// Packages
import React from 'react';
import { Jumbotron, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules
import Conf from '../../conf/conf';
import RejectedStore from '../../stores/RejectedStore';
import RejectedActions from '../../actions/RejectedActions';

// Components
import LiveTweets from './live/TweetsTabComponent';

// Socket io Instance
let socket = io.connect(Conf.socketHost);

// retweets update from the store
let getRejectedRewteetsState = () => {
  return {
    rejectedTweets: RejectedStore.getAllRejectedRewteets()
  };
};

class RejectedTweetsComponent extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._rejectedCounter = this._rejectedCounter.bind(this);
  }

  componentWillMount() {
    let liveTweets = {
      rejectedTweets: []
    };

    this.setState(liveTweets);

    // Fetch all the rejected retweets
    socket.emit('rejected:retweets:all');

    // Display them when we get them back
    socket.on('rejected:retweets:all', (retweets) => {
      RejectedActions.getAllRejected(retweets);
    });

    socket.on('rejected:retweets:new', (retweet) => {
      RejectedActions.addRejectedTweet(retweet);
    });
  }

  componentDidMount() {
    // Watch changes from the store
    RejectedStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    // Remove listeners on route change, preventing double bindings
    RejectedStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('rejected:retweets:all');
    socket.removeAllListeners('rejected:retweets:new');
  }

  render() {

    return (
      <section id="displayed-tweets" className="container">
        {/* Header */}
        <Jumbotron>
          <PageHeader>
            Tweets refusés – <small>{ this._rejectedCounter() }</small>
          </PageHeader>
        </Jumbotron>

        {/* Tweets tab */}
        <LiveTweets liveTweets={ this.state.rejectedTweets } actionsType="rejected"/>
      </section>
    )

  }

  _rejectedCounter() {
    let counter = this.state.rejectedTweets.length;
    return counter + ' refusé' + (counter > 1 ? 's' : '');
  }

  _onChange() {
    this.setState(getRejectedRewteetsState());
  }

}

export default RejectedTweetsComponent;
