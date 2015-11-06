// NPM
import { EventEmitter } from 'events';
import { lib } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';

// Modules
import Conf from '../conf/conf';
import Utils from '../mixins/utils';
import AppDispatcher from '../dispatchers/AppDispatcher';
import LivestreamActions from '../actions/LivestreamActions';
import LivestreamConstants from '../constants/LivestreamConstants';

// Internal object representing the retweets
let _retweets = [];

// Socket io Instance
let socket = io.connect(Conf.socketHost);

function getAllRewteets() {
  return _retweets;
}

function loadMore(tweets) {
  _retweets.push(...tweets);
}

function rewteetCounter() {
  return _retweets.length;
}

function loadRetweets(retweets) {
  _retweets = retweets;
}

function removeRetweet(retweet) {
  _retweets = _retweets.filter((rt) => rt.rtId !== retweet);
}

function addRetweet(retweet) {
  _retweets.push(retweet);
}

// Merge our store with Node's Event Emitter
let LiveStreamStore = _.merge(EventEmitter.prototype, {

  loadRetweets(tweets) {
    loadRetweets(tweets);
  },

  // Returns all the retweets
  getAllRewteets() {
    return _retweets;
  },

  loadMore(tweets) {
    loadMore(tweets);
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
    case LivestreamConstants.LIVESTREAM_RETWEETS_ALL:
      loadRetweets(action.retweets);
      break;
    case LivestreamConstants.LIVESTREAM_RETWEETS_MORE:
      loadMore(action.retweets);
      break;
    case LivestreamConstants.LIVESTREAM_RETWEETS_NEW:
      addRetweet(action.retweet);
      break;
    case LivestreamConstants.LIVESTREAM_RETWEETS_DELETE:
      removeRetweet(action.retweet);
      break;
    case LivestreamConstants.LIVESTREAM_RETWEETS_REJECT:
      removeRetweet(action.retweet);
      break;
    case LivestreamConstants.LIVESTREAM_RETWEETS_VALIDATE:
      removeRetweet(action.retweet);
      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  LiveStreamStore.emitChange();

  return true;

});

export default LiveStreamStore;
