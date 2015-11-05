import mongoose from 'mongoose';

let Schema = mongoose.Schema;

// Rewteet mongoDB model
let Rewteet = new Schema({
  tweetId: String,
  rtId: String,
  originalTweetId: String,
  displayQueueId: Number,
  username: String,
  name: String,
  location: String,
  photo: String,
  followers: { type: Number, default: 0},
  isValid: { type: Boolean, default: false },
  hasBeenValidated: { type: Boolean, default: false },
  hasBeenDisplayed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Rewteet', Rewteet);
