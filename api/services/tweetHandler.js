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
      let retweetId = tweet.retweeted_status.id_str.replace(/\'/g, "");
      // console.log(retweetId, tweet.text);

      this.checkOneOfDailyTweet(tweet, (err, matchingDailyTweets, tweet) => {
        if (!err && matchingDailyTweets.length) {

          // TODO: Save RT !

          // Broadcast the new tweet
          this.broadcast(tweet);
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
