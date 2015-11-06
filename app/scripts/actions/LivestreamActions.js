import AppDispatcher from '../dispatchers/AppDispatcher';
import LivestreamConstants from '../constants/LivestreamConstants';

// Define actions for the livestream
var LivestreamActions = {

  getAllRetweets: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_ALL,
      retweets: data.liveTweets.retweets
    });
  },

  moreRetweets: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_MORE,
      retweets: data.liveTweets.retweets
    });
  },

  counterUpdate: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_COUNTER,
      counter: data.notifications
    });
  },

  newRetweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_NEW,
      retweet: data.retweet
    });
  },

  rejectRetweet: function(tweetId) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_REJECT,
      retweet: tweetId
    });
  },

  validateRetweet: function(tweetId) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_VALIDATE,
      retweet: tweetId
    });
  },

};

export default LivestreamActions;
