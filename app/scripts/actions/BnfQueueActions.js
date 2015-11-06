import AppDispatcher from '../dispatchers/AppDispatcher';
import BnfQueueConstants from '../constants/BnfQueueConstants';

// Define actions for the BNF queue
var BnfQueueActions = {

  getAllBnfRetweets: function(data) {
    AppDispatcher.handleViewAction({
      actionType: BnfQueueConstants.BNF_QUEUE_ALL_ENTRIES,
      retweets: data.bnfQueueTweets
    });
  },

  newBnfEntry: function(data) {
    AppDispatcher.handleViewAction({
      actionType: BnfQueueConstants.BNF_QUEUE_NEW_ENTRY,
      retweet: data.retweet
    });
  },

  cancelDisplay: function(data) {
    AppDispatcher.handleViewAction({
      actionType: BnfQueueConstants.BNF_QUEUE_CANCEL_DISPLAY,
      retweet: data.retweet
    });
  },

  displayed: function(tweet) {
    AppDispatcher.handleViewAction({
      actionType: BnfQueueConstants.BNF_QUEUE_DISPLAYED,
      tweet: tweet
    });
  },

};

export default BnfQueueActions;
