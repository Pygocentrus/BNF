// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

// Modules & Components
import LiveTweets from './live/TweetsTabComponent';

class LiveComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      liveTweets: [
        { id: 'fbdsnb662N', username: '@coco', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
        { id: '632BNG2BB9', username: '@test', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
        { id: '7SBNJshd80', username: '@great', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
        { id: '9dsqnb78hs', username: '@super_man', photo: 'https://pbs.twimg.com/profile_images/540438285449838593/_X2DFW29_bigger.png' },
      ]
    });
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

}

export default LiveComponent;
