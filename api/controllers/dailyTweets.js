import mongoose from 'mongoose';
import { argv } from 'yargs';

// Modules
import DailyTweet from '../models/DailyTweet';
import Conf from '../conf';

// Vars
let mongoUri = argv.production ? Conf.mongo.prod : Conf.mongo.dev;

// Connect to mongo server
mongoose.connect('mongodb://' + mongoUri);

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

};

export default dailyTweetsCtrl;
