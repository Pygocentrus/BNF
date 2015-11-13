import AppDispatcher from '../dispatchers/AppDispatcher';
import RejectedConstants from '../constants/RejectedConstants';

// Define actions for the dashboard
var DashboardActions = {

  getAllRejected: function(data) {
    AppDispatcher.handleViewAction({
      actionType: RejectedConstants.REJECTED_ALL,
      retweets: data.retweets
    });
  },

  addRejectedTweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: RejectedConstants.REJECTED_NEW,
      tweet: data.tweet
    });
  },

};

export default DashboardActions;
