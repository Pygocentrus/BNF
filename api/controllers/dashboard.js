// NPM
import express, { Router } from 'express';
import mongoose from 'mongoose';
import { argv } from 'yargs';

// Modules
import DailyTweet from '../models/DailyTweet';
import Conf from '../conf';

// Vars
let router = new Router();
let mongoUri = argv.production ? Conf.mongo.prod : Conf.mongo.dev;

// Connect to mongo server
mongoose.connect('mongodb://' + mongoUri);

// Grab all daily tweets
router.get('/daily-tweets', (req, res) => {
  DailyTweet.find({}, (err, dailyTweets) => {
    res.send(dailyTweets);
  });
});

// Post a daily tweet
router.post('/daily-tweets', (req, res) => {
  let dailyTweet = new DailyTweet();

  dailyTweet.id = 0;
  dailyTweet.link = req.body.link;
  dailyTweet.date = new Date();

  dailyTweet.save((err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

export default router;
