'use strict';

// NPM
var AWS          = require('aws-sdk'),
    scheduler    = require('node-schedule'),
    fs           = require('fs'),
    _            = require('lodash');

// Services
var TweetHandler = require('../services/tweetHandler');

// Modules
var Conf         = require('../conf'),
    Utils        = require('../utils'),
    BnfQueueCtrl = require('../controllers/bnfQueue'),
    Retweet      = require('../models/Retweet');

let AwsWorker = {

  start: function(io) {
    AWS.config.region = 'eu-west-1';
    AWS.config.accessKeyId = Conf.awsApi.accessKeyId;
    AWS.config.secretAccessKey = Conf.awsApi.secretAccessKey;
    AWS.config.sessionToken = Conf.awsApi.sessionToken;

    let s3 = new AWS.S3();
    let _this = this;

    // Schedule a CRON job to run each minute
    scheduler.scheduleJob(Conf.vars.awsCronJobPatternDelay, () => {

      // Find each displayed retweets that hasn't been replied yet
      BnfQueueCtrl
        .getQueueReTweetsNotRepliedPromise()
        .then((retweets) => {

          _.forEach(retweets, (rt) => {
            let username = '@' + rt.username;

            // For each one of them, try to locate their AWS photo(s)
            // and answer back their RT using this photo as an uploaded media
            _this
              .listFilesFromPattern(s3, username, rt)
              .then(_this.isolateMostRecentFile.bind(_this, username))
              .then(_this.downloadFileFromAWS.bind(_this, s3))
              .then((data) => {
                if (data.status && data.path) {
                  // Use TwitterHandler to upload an manage Twitter API
                  new TweetHandler().uploadPhotoAndAnswerToRetweet(data.path, rt);
                } else {
                  // TODO: Use simple shortened link, perhaps classic following:
                  // this.fetchFileStatus(s3, rt);
                  console.log('Couldn\'t download file from AWS for ' + username);
                }
              })
              .catch(console.log);

          });
        })
        .catch();

    });
  },

  fetchFileStatus: function(s3, rt) {
    // Compose the filename according to the Twitter username
    let fileName = '@' + rt.username + '.jpg';

    let params = {
      Bucket: Conf.awsApi.bucket,
      Key: fileName
    };

    s3.headObject(params, (err, metadata) => {
      if (!err) {
        // let fileUrl = `${Conf.awsApi.server}/${Conf.awsApi.bucket}/${fileName}`;
        let fileUrl = Conf.awsApi.server + '/' + Conf.awsApi.bucket + '/' + fileName;

        // Update the retweet with its new BNF photo
        rt.bnfPhoto = fileUrl;
        rt.save((err, updatedRt) => {
          if (!err && updatedRt) {
            // Respond to the original retweet
            new TweetHandler().answerBackToRewteet(updatedRt);
          }
        });
      }
    });
  },

  listFilesFromPattern: function(s3, pattern, retweet) {
    return new Promise((resolve, reject) => {
      pattern = pattern || '';

      let params = {
        Bucket: Conf.awsApi.bucket,
        Prefix: pattern
      };

      s3.listObjects(params, (err, data) => {
        if (err || !data) {
          reject(err);
        } else {
          if (data.Contents && data.Contents.length) {
            // We found at least one photo
            resolve(data.Contents);
          } else {
            // If we didn't find any matching photo and it's been
            // more than an hour since it's been displayed,
            // we answer with simple text, without an image,
            // otherwise, we wait for an image
            if (Utils.hoursAwayFromDate(retweet.displayDate) < 1) {
              resolve(data.Contents);
            } else {
              // Otherwise, we answer with simple text, without an image
              new TweetHandler().replyToUserWithTextOnly(retweet);
              reject();
            }
          }
        }
      });
    });
  },

  downloadFileFromAWS: function(s3, filename) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: Conf.awsApi.bucket,
        Key: filename
      };

      let path = Conf.vars.awsTmpDownloadDirectory + filename;
      let file = fs.createWriteStream(path);

      // Callback handling to fulfill promise
      file.on('close', resolve.bind(this, { status: 'success', path: path }));
      file.on('error', reject);

      // Download the file through a stream
      s3.getObject(params)
        .createReadStream()
        .pipe(file);
    });
  },

  isolateMostRecentFile: function(username, files) {
    return new Promise((resolve, reject) => {
      let mostRecentFile;

      mostRecentFile = files.reduce((previousFile, currentFile) => {
        let currentTimestamp = Utils.timestampFromFileNameAws(currentFile.Key, username);
        let previousTimestamp = Utils.timestampFromFileNameAws(previousFile.Key, username);

        return currentTimestamp > previousTimestamp ? currentFile : previousFile;
      }, { Key: 0 });

      if (mostRecentFile.Key !== 0) {
        resolve(mostRecentFile.Key);
      } else {
        reject(null);
      }
    });
  },

}

module.exports = AwsWorker;
