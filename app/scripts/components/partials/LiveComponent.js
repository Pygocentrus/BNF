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
    liveTweets: LiveStreamStore.getAllRewteets()
  };
};

class LiveComponent extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._togglePlayPause = this._togglePlayPause.bind(this);
  }

  componentWillMount() {
    let liveTweets = {
      liveTweets: []
    };

    this.setState(liveTweets);

    socket.emit('livestream:retweets:all');
    socket.on('livestream:retweets:all', (retweets) => {
      LivestreamActions.getAllRetweets({ liveTweets: retweets });
    });

    socket.on('live:tweets:new', (retweet) => {
      LivestreamActions.newRetweet({ retweet: retweet.tweet });
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
    socket.removeAllListeners('livestream:retweets:all');
    socket.removeAllListeners('live:tweets:new');
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
            <Button ref="pauseBtn" bsStyle="warning" onClick={ this._togglePlayPause }>Pause</Button>
          </PageHeader>
        </Jumbotron>

        {/* Tweets tab */}
        <LiveTweets liveTweets={ this.state.liveTweets } actionsType="live"/>
      </section>
    );

  }

  _onChange() {
    this.setState(getRewteetsState());
  }

  _togglePlayPause() {
    let btn = ReactDOM.findDOMNode(this.refs.pauseBtn);
    btn.innerHTML = btn.innerHTML === 'Pause' ? 'Reprendre' : 'Pause';

    socket.emit(
      'livestream:retweets:toggle:playpause',
      { state: btn.innerHTML === 'Reprendre' ? 'paused' : 'running' }
    );
  }

}

export default LiveComponent;
