import AppDispatcher from '../dispatchers/AppDispatcher';
import DailyPhotoMessageConstants from '../constants/DailyPhotoMessageConstants';

// Define actions for the BNF queue
var DailyPhotoMessageActions = {

  setLatestMessage: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_LATEST,
      message: data.message
    });
  },

  updateLatestMessage: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_UPDATE,
      message: data.message
    });
  },

  updateLatestMessageApi: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_UPDATE_API,
      message: data.message
    });
  },

  newLatestMessage: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_NEW,
      message: data.message
    });
  },

  newLatestMessageApi: function(data) {
    AppDispatcher.handleViewAction({
      actionType: DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_NEW_API,
      message: data.message
    });
  },

};

export default DailyPhotoMessageActions;
