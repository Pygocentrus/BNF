import mongoose from 'mongoose';
import { argv } from 'yargs';

// Modules
import Retweet from '../models/Retweet';
import Conf from '../conf';

let livestreamCtrl = {

  getReTweets: function(cb) {
    Retweet
      .find({})
      .sort({ date: 'asc' })
      .exec((err, retweets) => {
        if (err || !retweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, retweets);
        }
      });
  },

};

export default livestreamCtrl;
