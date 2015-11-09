import mongoose from 'mongoose';
import _ from 'lodash';

// Modules
import Retweet from '../models/Retweet';

let displayedTweetsCtrl = {

  getDisplayedTweets: function(cb) {
    Retweet
      .find({ hasBeenValidated: true, isValid: true, hasBeenDisplayed: true })
      .sort({ displayDate: 'asc' })
      .exec((err, retweets) => {
        if (err || !retweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, retweets);
        }
      });
  },

};

export default displayedTweetsCtrl;
