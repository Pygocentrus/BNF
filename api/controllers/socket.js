'use strict';

// Controllers
var DailyTweetsCtrl = require('./dailyTweets'),
    LivestreamCtrl  = require('./liveStream'),
    BnfQueueCtrl    = require('./bnfQueue'),
    DisplayedCtrl   = require('./displayed'),
    RejectedCtrl    = require('./rejected');

let SocketManager = {

  handleClient: function(socket, io, twitterWorker) {
    // Dashboard all tweets
    socket.on('dashboard:daily-tweets:all', () => {
      DailyTweetsCtrl.getDailyTweets((err, dailyTweets) => {
        io.emit('dashboard:daily-tweets:all', { dailyTweets: dailyTweets, err: err });
      });
    });

    // New daily tweet added
    socket.on('dashboard:daily-tweets:new', (tweet) => {
      DailyTweetsCtrl.postDailyTweet(tweet, (err, newTweet) => {
        io.emit('dashboard:daily-tweets:new', { tweet: newTweet, err: err });
      });
    });

    // Remove daily tweet
    socket.on('dashboard:daily-tweets:remove', (data) => {
      DailyTweetsCtrl.removeDailyTweet(data.tweet, (err) => {
        io.emit('dashboard:daily-tweets:remove', { status: err === null ? 200 : 500 });
      });
    });

    // Get all rewteets in the /live
    socket.on('livestream:retweets:all', () => {
      LivestreamCtrl.getReTweets((err, retweets) => {
        io.emit('livestream:retweets:all', { retweets: retweets, err: err });
      });
    });

    // Get 50 tweets from the livestream
    socket.on('livestream:retweets:more', (options) => {
      options = options || {};
      LivestreamCtrl.getMoreTweets(options, (err, retweets) => {
        io.emit('livestream:retweets:more', { retweets: retweets, err: err });
      });
    });

    // Toggle play/pause, e.g whether we should listen to the stream API
    socket.on('livestream:retweets:toggle:playpause', (data) => {
      twitterWorker.setPauseState(data.state === 'paused');
    });

    // Validate a retweet
    socket.on('livestream:retweets:validate', (retweet) => {
      let options = { hasBeenValidated: true, isValid: true };

      LivestreamCtrl.updateReTweet(retweet, options, (err, rt) => {
        if (!err) {
          io.emit('livestream:retweets:validate', { retweet: rt, err: err });
        }
      });
    });

    // Reject a retweet
    socket.on('livestream:retweets:reject', (retweet) => {
      let options = { hasBeenValidated: true, isValid: false };

      LivestreamCtrl.updateReTweet(retweet, options, (err, rt) => {
        if (!err) {
          io.emit('livestream:retweets:reject', { retweet: rt, err: err });
        }
      });
    });

    // Ask for all validated retweets in the display queue
    socket.on('queue:retweets:all', () => {
      BnfQueueCtrl.getQueueReTweets((err, retweets) => {
        io.emit('queue:retweets:all', { retweets: retweets, err: err });
      });
    });

    // Cancel an enqueued tweet
    socket.on('queue:retweets:cancel', (data) => {
      BnfQueueCtrl.cancelQueueReTweet(data.retweetId, (err, tweet) => {
        io.emit('queue:retweets:cancel', { retweet: tweet, err: err });
      });
    });

    // Get all displayed tweets
    socket.on('displayed:retweets:all', () => {
      DisplayedCtrl.getDisplayedTweets((err, retweets) => {
        io.emit('displayed:retweets:all', { retweets: retweets, err: err });
      });
    });

    // Get all rejected tweets
    socket.on('rejected:retweets:all', () => {
      RejectedCtrl.getRejectedTweets((err, retweets) => {
        io.emit('rejected:retweets:all', { retweets: retweets, err: err });
      });
    });
  },

};

module.exports = SocketManager;
