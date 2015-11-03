import mongoose from 'mongoose';

let Schema = mongoose.Schema;

// DailyTweet mongoDB model
let DailyTweet = new Schema({
  id: Number,
  link: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('DailyTweet', DailyTweet);
