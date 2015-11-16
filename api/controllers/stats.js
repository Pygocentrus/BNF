'use strict';

var mongoose = require('mongoose'),
    _        = require('lodash');

// Modules
var Retweet  = require('../models/Retweet');

let StatsTweetsCtrl = {

  getAllTweets: function(cb) {
    Retweet
      .find()
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

module.exports = StatsTweetsCtrl;
