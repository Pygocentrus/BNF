import AppDispatcher from '../dispatcher/AppDispatcher';
import DashboardConstants from '../constants/DashboardConstants';

// Define actions for the dashboard
var DashboardActions = {

  addTweet: function(data) {
    AppDispatcher.handleAction({
      actionType: DashboardConstants.DASHBOARD_TWEET_ADD,
      data: data
    });
  },

};

export default DashboardActions;
