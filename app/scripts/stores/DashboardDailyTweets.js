// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';

// Modules
import Conf from '../conf/conf';
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import DashboardConstants from '../constants/DashboardConstants';
import globalActions from '../actions/GlobalActions';

// Internal object of daily tweets
let _dailyTweets = [];
let _newTweetUrl = '';

// Socket io Instance
let socket = io.connect(Conf.socketHost);

function getDailyTweets() {
  return _dailyTweets;
}

function loadDailyTweets(tweets) {
  _dailyTweets = tweets;
}

function addTweet(tweetUrl) {
  if (Utils.isUrl(tweetUrl)) {
    // Add the tweet locally
    _dailyTweets.unshift({
      id: getNextIndex(),
      link: tweetUrl
    });

    // Add this tweet in the backend
    socket.emit('dashboard:daily-tweets:new', _.first(_dailyTweets));

    // Notify change
    setTimeout(function() {
      globalActions.triggerNotification({
        notification: {
          type: 'success',
          message: 'Retweet ajouté avec succès'
        }
      });
    }, 500);
  }
}

function removeTweet(tweetID) {
  // Send the request to the server
  socket.emit('dashboard:daily-tweets:remove', { tweet: tweetID });

  // Remove it locally
  _dailyTweets = _.remove(_dailyTweets, (tweet) => tweet.id !== tweetID);
}

function getNextIndex() {
  if (!_dailyTweets.length) {
    return 1;
  }
  return _.first(_dailyTweets).id + 1;
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
    console.log('Tweet', tweet);
    // Send the request to the server
    socket.emit('dashboard:daily-tweets:remove', { tweet: tweet });

    socket.on('dashboard:daily-tweets:remove', (data) => {
      if (data & data.tweet) {
        // Remove it locally
        if (tweet && tweet.id) {
          removeTweet(tweet.id);
        }
      }
    });
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
    case DashboardConstants.DASHBOARD_TWEETS_ALL:
      loadDailyTweets(action.tweets);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  DailyTweetStore.emitChange();

  return true;

});

export default DailyTweetStore;
