'use strict';

var mongoose   = require('mongoose');

// Modules
var DailyTweet = require('../models/DailyTweet'),
    Conf       = require('../conf');

let dailyTweetsCtrl = {

  getDailyTweets: function(cb) {
    DailyTweet
      .find({})
      .sort({ date: 'desc' })
      .exec((err, dailyTweets) => {
        if (err || !dailyTweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, dailyTweets);
        }
      });
  },

  postDailyTweet: function(tweet, cb) {
    let dailyTweet = new DailyTweet();

    dailyTweet.id = tweet.id || Date.now();
    dailyTweet.link = tweet.link;
    dailyTweet.date = new Date();

    dailyTweet.save((err, tweet) => {
      if (err || !tweet) {
        cb.call(this, err, null);
      } else {
        cb.call(this, null, tweet);
      }
    });
  },

  removeDailyTweet: function(tweetId, cb) {
    DailyTweet.remove({ id: tweetId }, (err, tweet) => {
      if (err || !tweet) {
        cb.call(this, err, null);
      } else {
        cb.call(this, null);
      }
    });
  },

};

module.exports = dailyTweetsCtrl;
