'use strict';

// NPM
var AWS          = require('aws-sdk'),
    scheduler    = require('node-schedule'),
    _            = require('lodash');

// Services
var TweetHandler = require('../services/tweetHandler');

// Modules
var Conf         = require('../conf'),
    BnfQueueCtrl = require('../controllers/bnfQueue'),
    Retweet      = require('../models/Retweet');

let AwsWorker = {

  start: function(io) {
    AWS.config.region = 'eu-west-1';
    AWS.config.accessKeyId = Conf.awsApi.accessKeyId;
    AWS.config.secretAccessKey = Conf.awsApi.secretAccessKey;
    AWS.config.sessionToken = Conf.awsApi.sessionToken;

    let s3 = new AWS.S3();

    // Schedule a CRON job to run each minute
    scheduler.scheduleJob(Conf.vars.awsCronJobPatternDelay, () => {

      // Find each displayed retweets without BNF picture
      BnfQueueCtrl
        .getQueueReTweetsPromise()
        .then((retweets) => {

          // For each one of them, try to locate its AWS photo
          _.forEach(retweets, (rt) => {
            // Let's find the AWS file for that username
            this.fetchFileStatus(s3, rt);
          });
        });

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

}

module.exports = AwsWorker;
