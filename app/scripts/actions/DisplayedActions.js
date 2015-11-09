import AppDispatcher from '../dispatchers/AppDispatcher';
import DisplayedConstants from '../constants/DisplayedConstants';

// Define actions for the dashboard
var DashboardActions = {

  getAllDisplayed: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DisplayedConstants.DISPLAYED_ALL,
      retweets: data.retweets
    });
  },

  addDisplayedTweet: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DisplayedConstants.DISPLAYED_NEW,
      tweet: data.tweet
    });
  },

};

export default DashboardActions;
