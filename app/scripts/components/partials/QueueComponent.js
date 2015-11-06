// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules
import Conf from '../../conf/conf';
import AppDispatcher from '../../dispatchers/AppDispatcher';
import BnfQueueStore from '../../stores/BnfQueueStore';
import BnfQueueActions from '../../actions/BnfQueueActions';
import BnfQueueConstants from '../../constants/BnfQueueConstants';

// Components
import LiveTweets from './live/TweetsTabComponent';

// Socket io Instance
let socket = io.connect(Conf.socketHost);

// retweets update from the store
let getRewteetsState = () => {
  return {
    bnfQueueTweets: BnfQueueStore.getFullQueue()
  };
};

class QueueComponent extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    let bnfQueueTweets = {
      bnfQueueTweets: []
    };

    this.setState(bnfQueueTweets);

    socket.emit('queue:retweets:all');
    socket.on('queue:retweets:all', (retweets) => {
      BnfQueueActions.getAllBnfRetweets({ bnfQueueTweets: retweets });
    });

    // socket.on('live:tweets:new', (retweet) => {
    //   BnfQueueActions.newBnfEntry({ retweet: retweet.tweet });
    // });
  }

  componentDidMount() {
    // Watch changes from the store
    BnfQueueStore.addChangeListener(this._onChange);

    // Validate / reject tweet server calls through socket
    AppDispatcher.register((payload) => {
      let action = payload.action;

      switch(action.actionType) {
        // case LivestreamConstants.LIVESTREAM_RETWEETS_VALIDATE:
        //   socket.emit('livestream:retweets:validate', { retweet: action.retweet });
        //   break;
        default:
          return true;
      }
      return true;
    });
  }

  componentWillUnmount() {
    // Remove listeners on route change, preventing double bindings
    BnfQueueStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('queue:retweets:all');
    // socket.removeAllListeners('queue:retweets:new');
  }

  render() {

    return (
      <section id="bnf-queue" className="container">
        {/* Header */}
        <Jumbotron>
          <PageHeader>
            File d'attente
          </PageHeader>
          <p>Tweets validés en attente d'affichage sur la BNF</p>
        </Jumbotron>

        {/* Tweets tab */}
        <LiveTweets liveTweets={ this.state.bnfQueueTweets } actionsType="queue"/>
      </section>
    );

  }

  _onChange() {
    this.setState(getRewteetsState());
  }

}

export default QueueComponent;
