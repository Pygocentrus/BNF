// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import _ from 'lodash';

// Modules
import AppDispatcher from '../dispatchers/AppDispatcher';
import DashboardConstants from '../constants/DashboardConstants';

// Internal object of daily tweets
var _dailyTweets = {};

// Method to load shoes from action data
function loadDailyTweets(data) {
  _dailyTweets = data.dailyTweets;
}

// Merge our store with Node's Event Emitter
let DailyTweetStore = lib.merge(EventEmitter.prototype, {

  // Returns all daily tweets from the main account
  getAllDailyTweets() {
    return _dailyTweets;
  },

  // Returns the current one, from today
  getDailyTweet() {
    return _.first(_dailyTweets);
  },

  emitChange() {
    this.emit('change');
  },

  addChangeListener(callback) {
    this.on('change', callback);
  },

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

});

// Register dispatcher callback
AppDispatcher.register((payload) => {
  let action = payload.action;

  // Define what to do for certain actions
  switch(action.actionType) {
    case DashboardConstants.DASHBOARD_TWEET_ADD:
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  DailyTweetStore.emitChange();

  return true;

});

export default DailyTweetStore;
