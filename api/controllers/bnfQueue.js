import mongoose from 'mongoose';
import { argv } from 'yargs';
import _ from 'lodash';

// Modules
import Retweet from '../models/Retweet';
import Conf from '../conf';

let BnfQueueCtrl = {

  getQueueReTweets: function(cb) {
    Retweet
      .find({ isValid: true, hasBeenValidated: true, hasBeenDisplayed: false })
      .exec((err, retweets) => {
        if (err || !retweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, retweets);
        }
      });
  },

  cancelQueueReTweet: function(rtId, cb) {
    Retweet.findOne({ rtId: rtId }, (err, retweet) => {
      if (err || !retweet) {
        cb(err, null);
      } else {

        // Cancel its status
        retweet.isValid = false;

        // Save it
        retweet.save((err, tweet) => {
          if (err || !tweet) {
            cb(err, null);
          } else {
            // Send back the freshly save tweet
            cb(null, tweet);
          }
        });
      }
    });
  },

};

export default BnfQueueCtrl;
