import AppDispatcher from '../dispatchers/AppDispatcher';
import DashboardConstants from '../constants/DashboardConstants';

// Define actions for the dashboard
var DashboardActions = {

  addTweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DashboardConstants.DASHBOARD_TWEETS_ADD,
      tweet: data
    });
  },

  removeTweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DashboardConstants.DASHBOARD_TWEETS_REMOVE,
      data: data
    });
  },

};

export default DashboardActions;
