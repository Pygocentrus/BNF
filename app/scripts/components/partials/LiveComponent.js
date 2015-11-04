// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules & Components
import Conf from '../../conf/conf';
import LiveStreamStore from '../../stores/LivestreamStore';
import LivestreamActions from '../../actions/LivestreamActions';
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
  }

  componentWillMount() {
    let liveTweets = {
      liveTweets: [
        { id: 'fbdsnb662N', username: '@coco', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
        { id: '632BNG2BB9', username: '@test', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
        { id: '7SBNJshd80', username: '@great', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
        { id: '9dsqnb78hs', username: '@super_man', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
      ]
    };

    this.setState(liveTweets);

    socket.emit('livestream:retweets:all');
    socket.on('livestream:retweets:all', (retweets) => {
      console.log('All!', retweets);
      // TODO: Dispatch the retweets to the dispatcher through the action
    });

    socket.on('live:tweets:new', (tweet) => {
      console.log('tweet:', tweet);
    });

    LivestreamActions.getAllRetweets(liveTweets);

    setTimeout(function() {
      LivestreamActions.newRetweet({
        retweet: {
          id: 'dbs7bd2YU7',
          username: '@brian',
          photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png'
        }
      });
    }, 2000);
  }

  componentDidMount() {
    // Watch changes from the store
    LiveStreamStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    // Remove listeners on route change, preventing double bindings
    LiveStreamStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('livestream:retweets:all');
  }

  render() {

    return (
      <section id="livestream" className="container">
        {/* Intro header */}
        <Jumbotron>
          <PageHeader>
            Livestream Tweeter
          </PageHeader>
        </Jumbotron>

        {/* Tweets tab */}
        <LiveTweets liveTweets={ this.state.liveTweets }/>
      </section>
    );

  }

  _onChange() {
    this.setState(getRewteetsState());
  }

}

export default LiveComponent;
