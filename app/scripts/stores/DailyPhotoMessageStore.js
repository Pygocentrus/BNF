// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import _ from 'lodash';

// Modules
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import globalActions from '../actions/GlobalActions';
import DailyPhotoMessageActions from '../actions/DailyPhotoMessageActions';
import DailyPhotoMessageConstants from '../constants/DailyPhotoMessageConstants';
import dailyPhotoMessageApi from '../api/dailyPhotoMessageApi';

// Internal object representing the message
let _message = {};

function loadMessage(message) {
  _message = message;
}

function getDailyPhotoMessage() {
  return _message;
}

function newMessage(message) {
  dailyPhotoMessageApi.postNewMessage(message);
}

function updateMessage(message) {
  _message = message;

  // Notify change
  setTimeout(function() {
    globalActions.triggerNotification({
      notification: {
        type: 'success',
        message: 'Message modifié avec succès !'
      }
    });
  }, 500);
}

function updateMessageAPI(message) {
  if (_message && _message._id && _message.content) {
    _message.content = message;
    dailyPhotoMessageApi.updateMessage(_message);
  }
}

// Merge our store with Node's Event Emitter
let DailyPhotoMessageStore = _.merge(EventEmitter.prototype, {

  loadMessage(message) {
    loadMessage(message);
  },

  containsMessage() {
    let curMessage = getDailyPhotoMessage();
    return curMessage && typeof curMessage._id !== 'undefined';
  },

  getDailyPhotoMessage() {
    return getDailyPhotoMessage();
  },

  emitChange() {
    this.emit('change');
  },

  addChangeListener(callback) {
    this.on('change', callback);
  },

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  },

});

// Register dispatcher callback
DailyPhotoMessageStore.dispatchToken = AppDispatcher.register((payload) => {
  let action = payload.action;

  // Define what to do for certain actions
  switch(action.actionType) {
    case DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_LATEST:
      if (action.message && action.message.length) {
        loadMessage(action.message[0]);
      }
      break;
    case DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_UPDATE:
      updateMessageAPI(action.message);
      break;
    case DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_UPDATE_API:
      updateMessage(action.message);
      break;
    case DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_NEW:
      newMessage(action.message);
      break;
    case DailyPhotoMessageConstants.BNF_DAILY_MESSAGE_NEW_API:
      updateMessage(action.message);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  DailyPhotoMessageStore.emitChange();

  return true;

});

export default DailyPhotoMessageStore;
