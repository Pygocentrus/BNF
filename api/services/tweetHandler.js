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

TweetHandler.prototype.getTwitterApiInstance = function() {
  return new Twit({
    consumer_key: Conf.twitterApi.consumer_key,
    consumer_secret: Conf.twitterApi.consumer_secret,
    access_token: Conf.twitterApi.access_token,
    access_token_secret: Conf.twitterApi.access_token_secret
  });
};

TweetHandler.prototype.checkOneOfDailyTweet = function(tweet, cb) {
  let retweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");
  let link = 'https?://twitter.com/' + Conf.twitterApi.account + '/status/' + retweetId;

  DailyTweet.find({ link: new RegExp('^' + link + '/?$', 'i') }, (err, rt) => {
    cb(err, rt, tweet);
  });
};

TweetHandler.prototype.answerBackToRewteet = function(retweet) {
  if (!retweet.hasBeenReplied && retweet.bnfPhoto) {
    let file = 'api/templates/thanks_' + retweet.lang + '.hbs';

    // Check lang template, shorten image URL, send tweet response & update status
    Utils.readFilePromisified(file)
      .then(this.shortenPhotoLink.bind(null, retweet.bnfPhoto))
      .then(this.replyToUserWithUrl.bind(null, retweet))
      .then(this.updateAnsweredStatus)
      .catch(console.log);
  }
};

TweetHandler.prototype.shortenPhotoLink = function(link, template) {
  return new Promise((resolve, reject) => {
    if (link) {
      let key = Conf.googleApi.apiKeyFront;
      let url = Conf.googleApi.shortenerUrl + '?key=' + key + '&longUrl=' + link;

      // Ask Google to shorten the url
      request({
        url: url + '?key=' + key + '&longUrl=' + link,
        method: "POST",
        json: true,
        body: { longUrl: link, key: key }
      }, (error, response, body) => {
        if (error || !body) {
          resolve({ shortenedUrl: null, template: template });
        } else {
          resolve({ shortenedUrl: body, template: template });
        }
      });
    } else {
      resolve({ shortenedUrl: null, template: template });
    }
  });
};

TweetHandler.prototype.uploadPhotoAndAnswerToRetweet = function(filePath, retweet) {
  // Open Twitter API instance
  let T = this.getTwitterApiInstance();

  // Upload photo to Twitter,
  // then answer back to the retweet using this media, to embed the photo
  // so as to avoid direct links towards AWS's picture links
  // then delete local image file
  this.uploadPhoto(T, filePath)
    .then(this.replyToUserWithMedia.bind(this, T, retweet))
    .then(this.updateAnsweredStatus)
    .then(Utils.deleteFilePromisified.bind(this, filePath))
    .catch(console.log);
};

TweetHandler.prototype.uploadPhoto = function(T, filePath) {
  return new Promise((resolve, reject) => {
    if (filePath) {
      let b64content = fs.readFileSync(filePath, { encoding: 'base64' });

      // Post the media through Twitter API
      T.post('media/upload', { media_data: b64content }, (err, data, response) => {
        if (err || !data || !data.media_id_string) {
          reject(err);
        } else {
          // Resolve its string ID to link it towards the future response
          resolve(data.media_id_string);
        }
      });
    } else {
      reject({ status: 'error', message: 'No file path specified' });
    }
  });
};

TweetHandler.prototype.composeMessageWithEmbeddedPhoto = function(retweet, cb) {
  // Open & compile the message according to the user's language
  let file = 'api/templates/thanks_' + retweet.lang + '.hbs';

  fs.readFile(file, 'utf-8', (err, data) => {
    if (!err && data) {
      // Compile the message
      let tpl = Handlebars.compile(data);
      let message = tpl({ username: retweet.username });

      cb.call(this, null, message);
    } else {
      cb.call(this, err, null);
    }
  });
};

TweetHandler.prototype.replyToUserWithMedia = function(T, retweet, mediaIdStr) {
  let _this = this;

  return new Promise((resolve, reject) => {
    // Fetch answer template according to user's default language
    _this.composeMessageWithEmbeddedPhoto(retweet, (err, message) => {
      if (err) {
        // Use default message if something happened with the template file
        message = [
          '@',
          retweet.username,
          ' Merci de votre engagement pour la biodiversité ! ',
          'Suivez l’expédition #WildTouchExpeditions - Antarctica!'
        ].join('');
      }

      // Status params, using RT ID, media ID & message
      let params = {
        status: message,
        in_reply_to_status_id: retweet.rtIdStr,
        media_ids: [mediaIdStr]
      };

      // Send back the RT response
      T.post('statuses/update', params, (err, data, response) => {
        if (!err) {
          resolve(retweet);
        } else {
          reject(retweet);
        }
      });
    });
  });
};

TweetHandler.prototype.replyToUserWithUrl = function(retweet, data) {
  return new Promise((resolve, reject) => {
    let template = data.template;
    let tpl = Handlebars.compile(template);

    // Use shortened photo, fallback to regular url otherwise
    let link = data.shortenedUrl.id !== 'undefined'
      ? data.shortenedUrl.id
      : rewteet.bnfPhoto;

    // Compile the message
    let message = tpl({ username: retweet.username, picture: link });

    let T = this.getTwitterApiInstance();

    // Answer to the user retweet
    // using this new compiled message & the shortened link
    T.post('statuses/update', {
      in_reply_to_status_id: retweet.rtIdStr,
      status: message
    }, (err, data, response) => {
      if (!err) {
        resolve(retweet);
      } else {
        reject(retweet);
      }
    });
  });
};

TweetHandler.prototype.checkCountry = function(retweet) {
  return new Promise((resolve, reject) => {
    let string = retweet.location || retweet.time_zone || retweet.description;

    if (string) {
      let url = [
        Conf.googleApi.translateUrl,
        Conf.googleApi.apiKey,
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
  return new Promise((resolve, reject) => {
    // Update the rewteet status
    Retweet.findOne({ rtId: retweet.rtId }, (err, rt) => {
      if (err || !rt) {
        console.log('8. Didnt find any RT to update');
        // Error
      } else {
        // If we found the rewteet, let's update its status
        // to hasBeenReplied
        rt.hasBeenReplied = true;
        rt.save((err, retweet) => {
          resolve(null);
        });
      }
    });
  });
};

TweetHandler.prototype.broadcast = function(tweet) {
  this.io.sockets.emit('live:tweets:new', { tweet: tweet });
};

TweetHandler.prototype.manage = function(tweet) {
  var _this = this;

  if (_this.isNotMainAccountTweet(tweet) && _this.isRetweet(tweet)) {

    let reTweetId = tweet.id_str.replace(/\'/g, "");
    let originalTweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");

    _this.checkOneOfDailyTweet(tweet, (err, matchingDailyTweets, tweet) => {
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
            _this.broadcast(retweet);
          }
        });
      }
    });
  }
};

module.exports = TweetHandler;
