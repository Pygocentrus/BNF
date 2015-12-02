'use strict';

var mongoose = require('mongoose'),
    _        = require('lodash');

// Modules
var Retweet  = require('../models/Retweet'),
    Conf     = require('../conf');

let displayedTweetsCtrl = {

  getDisplayedTweets: function(cb) {
    Retweet
      .find({ hasBeenValidated: true, isValid: true, hasBeenDisplayed: true })
      .sort({ displayDate: 'desc' })
      .limit(Conf.vars.displayedOffset)
      .exec((err, retweets) => {
        if (err || !retweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, retweets);
        }
      });
  },

};

module.exports = displayedTweetsCtrl;
