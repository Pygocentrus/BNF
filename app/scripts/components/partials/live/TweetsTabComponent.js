// Packages
import React, { Component, PropTypes } from 'react';
import { Table, Row } from 'react-bootstrap';

// Single tweet card
import TweetRow from './TweetsRowComponent';

class TweetsTabComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {

    let tweets = this.props.liveTweets.map((tweet) => {
      return (
        <TweetRow
          key={ tweet.id }
          photo={ tweet.photo }
          username={ tweet.username }
          id={ tweet.id }
        />
      );
    });

    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Photo de profil</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { tweets }
        </tbody>
      </Table>
    );

  }

}

export default TweetsTabComponent;
