import mongoose from 'mongoose';
import _ from 'lodash';

// Modules
import Retweet from '../models/Retweet';

let rejectedTweetsCtrl = {

  getRejectedTweets: function(cb) {
    Retweet
      .find({ hasBeenValidated: true, isValid: false })
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

export default rejectedTweetsCtrl;
