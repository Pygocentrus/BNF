// NPM
import { Router } from 'express';
import DailyTweetsCtrl from '../controllers/dailyTweets';

// Vars
let router = new Router();

// Grab all daily tweets
router.get('/daily-tweets', (req, res) => {
  DailyTweetsCtrl.getDailyTweets((err, dailyTweets) => {
    if (err) {
      res.status(404);
      res.send({});
    }
    res.json(dailyTweets);
  });
});

// Post a daily tweet
router.post('/daily-tweets', (req, res) => {
  let tweet = { link: req.body.link };

  if (tweet.link && tweet.link.length) {
    DailyTweetsCtrl.postDailyTweet(tweet, (err, tweet) => {
      if (err) {
        res.status(404);
        res.send({});
      }
      res.json(tweet);
    });
  } else {
    res.status(300);
    res.send({});
  }
});

export default router;
