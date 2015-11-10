'use strict';

var mongoose = require('mongoose'),
    _        = require('lodash');

// Modules
var Retweet  = require('../models/Retweet'),
    Conf     = require('../conf');

let BnfQueueCtrl = {

  getQueueReTweets: function(cb) {
    // Grab all validated & not displayed yet retweets
    Retweet
      .find({ isValid: true, hasBeenValidated: true, hasBeenDisplayed: false })
      .sort({ date: 'asc' })
      .exec((err, retweets) => {
        if (err || !retweets) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, retweets);
        }
      });
  },

  getQueueReTweetsPromise: function() {
    // Find displayed retweets that
    // doesn't have a valid BNF photo yet
    return new Promise((resolve, reject) => {
      Retweet
        .find({
          isValid: true,
          hasBeenValidated: true,
          hasBeenDisplayed: true,
          bnfPhoto: null
        })
        .sort({ date: 'asc' })
        .exec((err, retweets) => {
          if (err || !retweets) {
            reject(err);
          } else {
            resolve(retweets);
          }
        });
    });
  },

  getNextQueueItem: function(io, cb) {
    // Find the next item in the queue
    Retweet
      .findOne({ isValid: true, hasBeenValidated: true, hasBeenDisplayed: false })
      .sort({ date: 'asc' })
      .exec((err, rt) => {
        if (err || !rt) {

          // We didn't find one, the queue might be empty
          // let's use another one already displayed instead,
          // as a placeholder
          Retweet.randomDisplayed(function(err, randRt) {
            if (err || !randRt) {
              cb.call(this, err, null);
            } else {
              io.sockets.emit('queue:retweets:displayed', { tweet: randRt });
              cb.call(this, null, randRt);
            }
          });
        } else {

          // If we have one, let's update its status
          // to hasBeenDisplayed
          rt.hasBeenDisplayed = true;
          rt.displayDate = new Date();

          rt.save((err, updatedRt) => {
            if (err || !updatedRt) {
              io.sockets.emit('queue:retweets:displayed', { tweet: rt });
              cb.call(this, null, rt);
            } else {
              // Update the queue
              io.sockets.emit('queue:retweets:displayed', { tweet: updatedRt });
              // Update the displayed section
              io.sockets.emit('displayed:retweets:new', { tweet: updatedRt });
              cb.call(this, null, updatedRt);
            }
          });
        }
      });
  },

  cancelQueueReTweet: function(rtId, cb) {
    // Cancel a validated tweet waiting for the queue
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

module.exports = BnfQueueCtrl;
