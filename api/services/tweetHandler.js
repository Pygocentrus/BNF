// NPM
import mongoose from 'mongoose';

// Modules
import Retweet from '../models/Retweet';

let TweetHandler = {

  manage(tweet) {
    // TODO: check user & text, then filter with daily tweets
    // if good, save the RT & eventually broadcast
    console.log(tweet);
  },

};

export default TweetHandler;
