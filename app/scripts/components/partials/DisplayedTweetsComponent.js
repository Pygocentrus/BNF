// Packages
import React from 'react';
import { Jumbotron, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules
import Conf from '../../conf/conf';
import DisplayedStore from '../../stores/DisplayedStore';
import DisplayedActions from '../../actions/DisplayedActions';

// Components
import DisplayedTabComponent from './displayed/DisplayedTabComponent';

// Socket io Instance
let socket = io.connect(Conf.socketHost);

// retweets update from the store
let getRewteetsState = () => {
  return {
    displayedTweets: DisplayedStore.getAllRewteets()
  };
};

class DisplayedTweetsComponent extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._displayedCounter = this._displayedCounter.bind(this);
  }

  componentWillMount() {
    let liveTweets = {
      displayedTweets: []
    };

    this.setState(liveTweets);

    // Fetch all the displayed retweets
    socket.emit('displayed:retweets:all');

    // Display them when we get them back
    socket.on('displayed:retweets:all', (retweets) => {
      DisplayedActions.getAllDisplayed(retweets);
    });

    socket.on('displayed:retweets:new', (retweet) => {
      DisplayedActions.addDisplayedTweet(retweet);
    });
  }

  componentDidMount() {
    // Watch changes from the store
    DisplayedStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    // Remove listeners on route change, preventing double bindings
    DisplayedStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('displayed:retweets:all');
    socket.removeAllListeners('displayed:retweets:new');
  }

  render() {

    return (
      <section id="displayed-tweets" className="container">
        {/* Header */}
        <Jumbotron>
          <PageHeader>
            Tweets affichés – <small>{ this._displayedCounter() }</small>
          </PageHeader>
        </Jumbotron>

        {/* Tweets tab */}
        <DisplayedTabComponent displayedTweets={ this.state.displayedTweets }/>
      </section>
    )

  }

  _displayedCounter() {
    let counter = this.state.displayedTweets.length;
    return counter + ' affiché' + (counter > 1 ? 's' : '');
  }

  _onChange() {
    this.setState(getRewteetsState());
  }

}

export default DisplayedTweetsComponent;
