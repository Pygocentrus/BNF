// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';

// Modules
import Conf from '../conf/conf';
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import BnfQueueActions from '../actions/BnfQueueActions';
import BnfQueueConstants from '../constants/BnfQueueConstants';

// Internal object representing the retweets
let _bnfRetweets = [];

// Socket io Instance
let socket = io.connect(Conf.socketHost);

function getAllRewteets() {
  return _bnfRetweets;
}

function rewteetCounter() {
  return _bnfRetweets.length;
}

function loadRetweets(retweets) {
  _bnfRetweets = retweets;
}

function removeRetweet(retweet) {
  _.remove(_bnfRetweets, (rt) => rt.rtId === retweet);
}

function addRetweet(retweet) {
  _bnfRetweets.push(retweet);
}

// Merge our store with Node's Event Emitter
let BnfQueueStore = _.merge(EventEmitter.prototype, {

  loadRetweets(tweets) {
    loadRetweets(tweets);
  },

  getFullQueue() {
    return _bnfRetweets;
  },

  rewteetCounter() {
    return rewteetCounter();
  },

  removeRetweet(retweet) {
    removeRetweet(rewteet);
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
    case BnfQueueConstants.BNF_QUEUE_ALL_ENTRIES:
      loadRetweets(action.retweets.retweets);
      break;
    case BnfQueueConstants.BNF_QUEUE_NEW_ENTRY:
      addRetweet(action.retweet);
      break;
    case BnfQueueConstants.BNF_QUEUE_CANCEL_DISPLAY:
      removeRetweet(action.retweet);
      break;
    case BnfQueueConstants.BNF_QUEUE_DISPLAYED:
      removeRetweet(action.tweet.rtId);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  BnfQueueStore.emitChange();

  return true;

});

export default BnfQueueStore;
