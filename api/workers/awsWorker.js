// NPM
import AWS from 'aws-sdk';
import scheduler from 'node-schedule';
import _ from 'lodash';

// Services
import TweetHandler from '../services/tweetHandler';

// Modules
import Conf from '../conf';
import BnfQueueCtrl from '../controllers/bnfQueue';
import Retweet from '../models/Retweet';

let AwsWorker = {

  start(io) {
    AWS.config.region = 'eu-west-1';
    AWS.config.accessKeyId = Conf.awsApi.accessKeyId;
    AWS.config.secretAccessKey = Conf.awsApi.secretAccessKey;
    AWS.config.sessionToken = Conf.awsApi.sessionToken;

    let s3 = new AWS.S3();
    let params = { Bucket: Conf.awsApi.bucket };
    let fileName = '';

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

  fetchFileStatus(s3, rt) {
    // Compose the filename according to the Twitter username
    let fileName = '@' + rt.username + '.jpg';

    let params = {
      Bucket: Conf.awsApi.bucket,
      Key: fileName
    };

    s3.headObject(params, (err, metadata) => {
      if (!err) {
        let fileUrl = `${Conf.awsApi.server}/${Conf.awsApi.bucket}/${fileName}`;

        // Update the retweet with its new BNF photo
        rt.bnfPhoto = fileUrl;
        rt.save((err, updatedRt) => {
          if (!err && updatedRt) {
            console.log('BNF picture uploaded for ', rt.username, '[' + rt.bnfPhoto + ']');

            // Respond to the original retweet
            new TweetHandler()
              .answerBackToRewteet(updatedRt);
          }
        });
      }
    });
  },

}

export default AwsWorker;
