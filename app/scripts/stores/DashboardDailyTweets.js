// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import _ from 'lodash';

// Modules
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import DashboardConstants from '../constants/DashboardConstants';

// Internal object of daily tweets
let _dailyTweets = [];
let _newTweetUrl = '';

function getDailyTweets() {
  return _dailyTweets;
}

function loadDailyTweets(tweets) {
  _dailyTweets = tweets;
}

function addTweet(tweetUrl) {
  if (Utils.isUrl(tweetUrl)) {
    _dailyTweets.push({
      id: getNextIndex(),
      link: tweetUrl
    });
  }
}

function removeTweet(tweetID) {
  _dailyTweets = _.remove(_dailyTweets, (tweet) => tweet.id !== tweetID);
}

function getNextIndex() {
  if (!_dailyTweets.length) {
    return 1;
  }
  return _.last(_dailyTweets).id + 1;
}

// Merge our store with Node's Event Emitter
let DailyTweetStore = _.merge(EventEmitter.prototype, {

  loadDailyTweets(tweets) {
    loadDailyTweets(tweets);
  },

  // Returns all daily tweets from the main account
  getAllDailyTweets() {
    return _dailyTweets;
  },

  // Returns the current one, from today
  getDailyTweet() {
    return _.first(_dailyTweets);
  },

  addDailyTweet(tweet) {
    addTweet(tweet);
  },

  removeDailyTweet(tweet) {
    if (tweet && tweet.id) {
      removeTweet(tweet.id);
    }
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
    case DashboardConstants.DASHBOARD_TWEETS_ADD:
      addTweet(action.tweet);
      break;
    case DashboardConstants.DASHBOARD_TWEETS_REMOVE:
      removeTweet(action.tweet);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  DailyTweetStore.emitChange();

  return true;

});

export default DailyTweetStore;
