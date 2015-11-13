// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';

// Modules
import Conf from '../conf/conf';
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import RejectedActions from '../actions/RejectedActions';
import RejectedConstants from '../constants/RejectedConstants';

// Internal object representing the retweets
let _rejectedRetweets = [];

// Socket io Instance
let socket = io.connect(Conf.socketHost);

function getAllRejectedRewteets() {
  return _rejectedRetweets;
}

function addRejectedRetweet(tweet) {
  _rejectedRetweets.push(tweet);
}

function rewteetCounter() {
  return _rejectedRetweets.length;
}

function loadRejectedRetweets(retweets) {
  _rejectedRetweets = retweets;
}

// Merge our store with Node's Event Emitter
let RejectedStore = _.merge(EventEmitter.prototype, {

  getAllRejectedRewteets() {
    return getAllRejectedRewteets();
  },

  addRetweet(tweet) {
    addRejectedRetweet(tweet);
  },

  loadRetweets(tweets) {
    loadRejectedRetweets(tweets);
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
    case RejectedConstants.REJECTED_ALL:
      loadRejectedRetweets(action.retweets);
      break;
    case RejectedConstants.REJECT_NEW:
      addRejectedRetweet(action.tweet);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  RejectedStore.emitChange();

  return true;

});

export default RejectedStore;
