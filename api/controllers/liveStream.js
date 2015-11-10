'use strict';

var mongoose = require('mongoose'),
    _        = require('lodash');

// Modules
var Retweet  = require('../models/Retweet'),
    Conf     = require('../conf');

let livestreamCtrl = {

  getReTweets: function(cb) {
    Retweet
      .find({ hasBeenValidated: false })
      .sort({ date: 'asc' })
      .exec((err, retweets) => {
        if (err || !retweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, retweets);
        }
      });
  },

  getMoreTweets: function(options, cb) {
    options = options || {};

    if (!options.offset) {
      Retweet
        .find({ hasBeenValidated: false })
        .sort({ date: 'asc' })
        .limit(Conf.vars.liveTweetOffset)
        .exec((err, retweets) => {
          if (err || !retweets) {
            cb.call(this, err, null);
          } else {
            cb.call(this, null, retweets);
          }
        });
    } else {
      Retweet
        .find({ hasBeenValidated: false })
        .sort({ date: 'asc' })
        .skip(options.offset)
        .limit(Conf.vars.liveTweetOffset)
        .exec((err, retweets) => {
          if (err || !retweets) {
            cb.call(this, err, null);
          } else {
            cb.call(this, null, retweets);
          }
        });
    }
  },

  updateReTweet: function(rt, options, cb) {
    // Find the tweet to update
    Retweet.findOne({ rtId: rt.retweet }, (err, retweet) => {
      if (err || !retweet) {
        cb(err, null);
      } else {

        // Update its status
        retweet = _.assign(retweet, options);

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
  }

};

module.exports = livestreamCtrl;
