'use strict';

var mongoose = require('mongoose');

let Schema = mongoose.Schema;

// DailyPhotoMessage mongoDB model
let DailyPhotoMessage = new Schema({
  content: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyPhotoMessage', DailyPhotoMessage);
