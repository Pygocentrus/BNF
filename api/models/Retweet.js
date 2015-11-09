import mongoose from 'mongoose';

let Schema = mongoose.Schema;

// Rewteet mongoDB model
let Rewteet = new Schema({
  tweetId: String,
  rtId: String,
  rtIdStr: String,
  originalTweetId: String,
  displayQueueId: Number,
  username: String,
  name: String,
  location: String,
  photo: { type: String, default: null },
  bnfPhoto: {type: String, default: null },
  followers: { type: Number, default: 0 },
  isValid: { type: Boolean, default: false },
  hasBeenValidated: { type: Boolean, default: false },
  hasBeenDisplayed: { type: Boolean, default: false },
  hasBeenReplied: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  displayDate: { type: Date, default: null },
});

Rewteet.statics.randomDisplayed = function(callback) {
  this.count({ isValid: true, hasBeenValidated: true, hasBeenDisplayed: true }, function(err, count) {
    if (err) {
      return callback(err);
    }

    var rand = Math.floor(Math.random() * count);

    this.findOne({ isValid: true, hasBeenValidated: true, hasBeenDisplayed: true })
      .skip(rand)
      .exec(callback);

  }.bind(this));
};

export default mongoose.model('Rewteet', Rewteet);
