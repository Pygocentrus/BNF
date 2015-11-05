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

};

export default BnfQueueCtrl;
