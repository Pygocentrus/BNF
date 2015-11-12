'use strict';

// NPM
var mongoose   = require('mongoose'),
    Twit       = require('twit'),
    Handlebars = require('handlebars'),
    request    = require('request'),
    fs         = require('fs'),
    _          = require('lodash');

// Modules
var Conf       = require('../conf'),
    Utils      = require('../utils'),
    Retweet    = require('../models/Retweet'),
    DailyTweet = require('../models/DailyTweet');

let TweetHandler = function(io) {
  this.io = io;
};

TweetHandler.prototype.isNotMainAccountTweet = function(tweet) {
  return tweet.user && tweet.user.screen_name !== Conf.twitterApi.account;
};

TweetHandler.prototype.isRetweet = function(tweet) {
  return typeof tweet.retweeted_status !== 'undefined';
};

TweetHandler.prototype.checkOneOfDailyTweet = function(tweet, cb) {
  let retweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");
  let link = 'https?://twitter.com/' + Conf.twitterApi.account + '/status/' + retweetId;

  DailyTweet.find({ link: new RegExp('^' + link + '/?$', 'i') }, (err, rt) => {
    cb(err, rt, tweet);
  });
};

TweetHandler.prototype.answerBackToRewteet = function(retweet) {
  let _this = this;

  if (!retweet.hasBeenReplied && retweet.bnfPhoto) {
    let T = new Twit({
      consumer_key: Conf.twitterApi.consumer_key,
      consumer_secret: Conf.twitterApi.consumer_secret,
      access_token: Conf.twitterApi.access_token,
      access_token_secret: Conf.twitterApi.access_token_secret
    });

    let file = 'api/templates/thanks_' + retweet.lang + '.hbs',
        message,
        source,
        tpl;

    // Compile the custom template and answer back to the user
    fs.readFile(file, (err, data) => {
      if (!err) {
        source  = data.toString();
        tpl     = Handlebars.compile(source);
        message = tpl({ username: retweet.username, picture: retweet.bnfPhoto });

        // Answer to the user retweet
        // using this new compiled message
        T.post('statuses/update', {
          in_reply_to_status_id: retweet.rtIdStr,
          status: message
        }, (err, data, response) => {
          if (!err) {
            _this.updateAnsweredStatus(retweet);
          }
        });
      } else {
        console.log('Err', err);
      }
    });
  }
};

TweetHandler.prototype.checkCountry = function(retweet) {
  return new Promise((resolve, reject) => {
    let string = retweet.location || retweet.time_zone || retweet.description;

    if (string) {
      let url = [
        Conf.googleApi.url,
        Conf.googleApi.keyParam,
        Conf.googleApi.queryParam,
        encodeURIComponent(string)
      ].join('');

      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let res = JSON.parse(body);
          resolve(_.first(res.data.detections));
        } else {
          reject(null);
        }
      });
    } else {
      reject(null);
    }
  });
};

TweetHandler.prototype.updateAnsweredStatus = function(retweet) {
  // Update the rewteet status
  Retweet.findOne({ rtId: retweet.rtId }, (err, rt) => {
    if (err || !rt) {
      // Error
    } else {
      // If we found the rewteet, let's update its status
      // to hasBeenReplied
      rt.hasBeenReplied = true;

      rt.save((err, updatedRt) => {
        if (err || !updatedRt) {}
        else {}
      });
    }
  });
};

TweetHandler.prototype.broadcast = function(tweet) {
  this.io.sockets.emit('live:tweets:new', { tweet: tweet });
};

TweetHandler.prototype.manage = function(tweet) {
  if (this.isNotMainAccountTweet(tweet) && this.isRetweet(tweet)) {

    let reTweetId = tweet.id_str.replace(/\'/g, "");
    let originalTweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");

    this.checkOneOfDailyTweet(tweet, (err, matchingDailyTweets, tweet) => {
      if (!err && matchingDailyTweets.length) {

        let rt = new Retweet();
        rt.tweetId = Date.now();
        rt.rtId = reTweetId;
        rt.rtIdStr = tweet.retweeted_status.id_str;
        rt.originalTweetId = originalTweetId;
        rt.username = tweet.user.screen_name;
        rt.name = tweet.user.name;
        rt.lang = ['fr', 'en'].indexOf(tweet.user.lang) > -1 ? tweet.user.lang : 'fr';
        rt.location = tweet.user.location;
        rt.photo = tweet.user.profile_image_url;
        rt.followers = tweet.user.followers_count;
        rt.date = Date.now();

        rt.save((err, retweet) => {
          if (!err && retweet) {
            // Broadcast the new tweet
            this.broadcast(retweet);
          }
        });
      }
    });
  }
};

module.exports = TweetHandler;
