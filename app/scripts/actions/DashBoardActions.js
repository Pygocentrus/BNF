import AppDispatcher from '../dispatchers/AppDispatcher';
import DashboardConstants from '../constants/DashboardConstants';

// Define actions for the dashboard
var DashboardActions = {

  getDailyTweets: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DashboardConstants.DASHBOARD_TWEETS_ALL,
      tweets: data.dailyTweets
    });
  },

  addTweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DashboardConstants.DASHBOARD_TWEETS_ADD,
      tweet: data
    });
  },

  removeTweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DashboardConstants.DASHBOARD_TWEETS_REMOVE,
      tweet: data.tweet
    });
  },

};

export default DashboardActions;
