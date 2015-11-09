// Packages
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules
import Conf from '../../conf/conf';
import AppDispatcher from '../../dispatchers/AppDispatcher';
import LiveStreamStore from '../../stores/LivestreamStore';
import LivestreamActions from '../../actions/LivestreamActions';
import LivestreamConstants from '../../constants/LivestreamConstants';

// Components
import LiveTweets from './live/TweetsTabComponent';

// Socket io Instance
let socket = io.connect(Conf.socketHost);

// retweets update from the store
let getRewteetsState = () => {
  return {
    liveTweets: LiveStreamStore.getDisplayedRewteets()
  };
};

class LiveComponent extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._loadMorePosts = this._loadMorePosts.bind(this);
    this._resetData = this._resetData.bind(this);

    // Fetch oldest elements with offset
    socket.emit('livestream:retweets:more', { offset: 0 });
  }

  componentWillMount() {
    this._resetData();

    // Display them when we get them back
    socket.on('livestream:retweets:more', (retweets) => {
      LivestreamActions.moreRetweets({ liveTweets: retweets });
    });
  }

  componentDidMount() {
    // Watch changes from the store
    LiveStreamStore.addChangeListener(this._onChange);

    // Validate / reject tweet server calls through socket
    AppDispatcher.register((payload) => {
      let action = payload.action;

      switch(action.actionType) {
        case LivestreamConstants.LIVESTREAM_RETWEETS_VALIDATE:
          socket.emit('livestream:retweets:validate', { retweet: action.retweet });
          break;
        case LivestreamConstants.LIVESTREAM_RETWEETS_REJECT:
          socket.emit('livestream:retweets:reject', { retweet: action.retweet });
          break;
        default:
          return true;
      }
      return true;
    });
  }

  componentWillUnmount() {
    // Remove listeners on route change, preventing double bindings
    LiveStreamStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('livestream:retweets:more');
    socket.removeAllListeners('livestream:retweets:all');
    socket.removeAllListeners('live:tweets:new');

    // Clear all retweets, teardrop to avoid double tweets
    // when coming back to the page later
    LivestreamActions.removeRetweets();
  }

  render() {

    return (
      <section id="livestream" className="container">
        {/* Intro header */}
        <Jumbotron>
          <PageHeader>
            Livestream Twitter @{ Conf.twitterAccount }
            <br />
            <small>({ this.state.liveTweets.length } éléments)</small>
            <br />
            <Button
              ref="loadMorePosts"
              bsStyle="primary"
              bsSize="large"
              onClick={ this._loadMorePosts }>Charger d'autres RT</Button>
          </PageHeader>
        </Jumbotron>

        {/* Tweets tab */}
        <LiveTweets liveTweets={ this.state.liveTweets } actionsType="live"/>
      </section>
    );

  }

  _resetData() {
    let liveTweets = {
      liveTweets: []
    };

    this.setState(liveTweets);
  }

  _onChange() {
    this.setState(getRewteetsState());
  }

  _loadMorePosts() {
    socket.emit('livestream:retweets:more', { offset: this.state.liveTweets.length });
  }

}

export default LiveComponent;
