import AppDispatcher from '../dispatchers/AppDispatcher';
import GlobalConstants from '../constants/GlobalConstants';

// Define actions for the dashboard
var GlobalActions = {

  triggerNotification: function(data) {
    AppDispatcher.handleViewAction({
      actionType: GlobalConstants.NOTIFICATION_SHOW,
      notification: data.notification
    });
  },

};

export default GlobalActions;
