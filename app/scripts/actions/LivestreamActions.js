import AppDispatcher from '../dispatchers/AppDispatcher';
import LivestreamConstants from '../constants/LivestreamConstants';

// Define actions for the livestream
var LivestreamActions = {

  getAllRetweets: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_ALL,
      retweets: data.liveTweets
    });
  },

  newRetweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_NEW,
      retweet: data.retweet
    });
  },

  rejectRetweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_REJECT,
      retweet: data.retweet
    });
  },

  validateRetweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: LivestreamConstants.LIVESTREAM_RETWEETS_VALIDATE,
      retweet: data.retweet
    });
  },

};

export default LivestreamActions;
