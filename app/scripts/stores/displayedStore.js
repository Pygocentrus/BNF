// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';

// Modules
import Conf from '../conf/conf';
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import DisplayedActions from '../actions/DisplayedActions';
import DisplayedConstants from '../constants/DisplayedConstants';

// Internal object representing the retweets
let _displayedRetweets = [];

// Socket io Instance
let socket = io.connect(Conf.socketHost);

function getAllRewteets() {
  return _displayedRetweets;
}

function addRetweet(tweet) {
  _displayedRetweets.push(tweet);
}

function rewteetCounter() {
  return _displayedRetweets.length;
}

function loadRetweets(retweets) {
  _displayedRetweets = retweets;
}

// Merge our store with Node's Event Emitter
let DisplayedStore = _.merge(EventEmitter.prototype, {

  getAllRewteets() {
    return getAllRewteets();
  },

  addRetweet(tweet) {
    addRetweet(tweet);
  },

  loadRetweets(tweets) {
    loadRetweets(tweets);
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
    case DisplayedConstants.DISPLAYED_ALL:
      loadRetweets(action.retweets);
      break;
    case DisplayedConstants.DISPLAYED_NEW:
      addRetweet(action.tweet);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  DisplayedStore.emitChange();

  return true;

});

export default DisplayedStore;
