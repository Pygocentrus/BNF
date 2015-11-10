'use strict';

var mongoose = require('mongoose');

let Schema = mongoose.Schema;

// DailyTweet mongoDB model
let DailyTweet = new Schema({
  id: Number,
  link: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyTweet', DailyTweet);
