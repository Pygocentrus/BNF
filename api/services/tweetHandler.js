// NPM
import mongoose from 'mongoose';

// Modules
import Conf from '../conf';
import Retweet from '../models/Retweet';
import DailyTweet from '../models/DailyTweet';

class TweetHandler {

  constructor(io) {
    this.io = io;
  }

  manage(tweet) {
    if (this.isNotMainAccountTweet(tweet) && this.isRetweet(tweet)) {
      let reTweetId = tweet.id_str.replace(/\'/g, "");
      let originalTweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");

      this.checkOneOfDailyTweet(tweet, (err, matchingDailyTweets, tweet) => {
        if (!err && matchingDailyTweets.length) {

          console.log('New: for [', originalTweetId, '] -', tweet.text.substr(0, 70));

          let rt = new Retweet();
          rt.tweetId = Date.now();
          rt.rtId = reTweetId;
          rt.originalTweetId = originalTweetId;
          rt.username = tweet.user.screen_name;
          rt.name = tweet.user.name;
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
  }

  isNotMainAccountTweet(tweet) {
    return tweet.user && tweet.user.screen_name !== Conf.twitterApi.account;
  }

  isRetweet(tweet) {
    return !!tweet.retweeted_status;
  }

  checkOneOfDailyTweet(tweet, cb) {
    let retweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");
    let link = 'https?://twitter.com/' + Conf.twitterApi.account + '/status/' + retweetId;

    DailyTweet.find({ link: new RegExp('^' + link + '/?$', 'i') }, (err, rt) => {
      cb(err, rt, tweet);
    });
  }

  broadcast(tweet) {
    this.io.sockets.emit('live:tweets:new', { tweet: tweet });
  }

}

export default TweetHandler;
