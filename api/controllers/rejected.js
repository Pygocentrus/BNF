'use strict';

var mongoose = require('mongoose'),
    _        = require('lodash');

// Modules
var Retweet = require('../models/Retweet');

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

module.exports = rejectedTweetsCtrl;
