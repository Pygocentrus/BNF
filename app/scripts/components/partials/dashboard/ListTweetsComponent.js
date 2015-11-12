// Packages
import React, { Component, PropTypes } from 'react';
import { Grid, Row } from 'react-bootstrap';

// Single tweet card
import TweetComponent from './TweetComponent';

class ListTweetsComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {

    let dailyTweets = [];

    // Compose each Tweet cards in the grid
    if (this.props.dailyTweets) {
      dailyTweets = this.props.dailyTweets.map( (tweet) => {
        return <TweetComponent key={ tweet.id } id={ tweet.id } link={ tweet.link }/>;
      });
    }

    return (
      <Grid>
        <Row className="show-grid">
          { dailyTweets }
        </Row>
      </Grid>
    );

  }

}

export default ListTweetsComponent;
