'use strict';

// NPM
var Twit = require('twit');

// Modules
var Conf = require('../conf'),
    TweetHandler = require('../services/tweetHandler');

let TwitterWorker = {

  start: function(io) {
    let tweetHandler = new TweetHandler(io);
    let _this = this;

    this.isPaused = false;

    let T = new Twit({
      consumer_key: Conf.twitterApi.consumer_key,
      consumer_secret: Conf.twitterApi.consumer_secret,
      access_token: Conf.twitterApi.access_token,
      access_token_secret: Conf.twitterApi.access_token_secret
    });

    // Track all conf accounts at the same time
    // coma-separated, so as to use Twitter's `OR` logical API
    let tracked = Conf.twitterApi.accounts.join();

    let stream = T.stream('statuses/filter', { track: tracked });

    // Each time we get a new tweet, we handle it
    stream.on('tweet', function (tweet) {
      if (!_this.isPaused) {
        tweetHandler.manage(tweet);
      }
    });
  },

  setPauseState: function(state) {
    this.isPaused = !!state;
  }

}

module.exports = TwitterWorker;
