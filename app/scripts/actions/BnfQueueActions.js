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

  cancelDisplay: function(tweetId) {
    AppDispatcher.handleViewAction({
      actionType: BnfQueueConstants.BNF_QUEUE_CANCEL_DISPLAY,
      retweet: tweetId
    });
  },

};

export default BnfQueueActions;
