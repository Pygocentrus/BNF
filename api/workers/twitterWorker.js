// NPM
import Twit from 'twit';

// Modules
import Conf from '../conf';
import TweetHandler from '../services/tweetHandler';

let worker = {

  start(io) {
    let tweetHandler = new TweetHandler(io);
    let _this = this;

    this.isPaused = false;

    let T = new Twit({
      consumer_key: Conf.twitterApi.consumer_key,
      consumer_secret: Conf.twitterApi.consumer_secret,
      access_token: Conf.twitterApi.access_token,
      access_token_secret: Conf.twitterApi.access_token_secret
    });

    // FIXME: change track's #xxxxx with #WildTouchExpeditions
    // let stream = T.stream('statuses/filter', { track: '#Antarctica' });
    let stream = T.stream('statuses/filter', { track: Conf.twitterApi.account });

    // Each time we get a new tweet, we handle it
    stream.on('tweet', function (tweet) {
      if (!_this.isPaused) {
        tweetHandler.manage(tweet);
      }
    });
  },

  setPauseState(state) {
    this.isPaused = !!state;
  }

}

export default worker;
