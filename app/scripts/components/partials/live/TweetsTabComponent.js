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

    let rows = this.props.liveTweets.length
      ? this.props.liveTweets.filter((tw) => tw && tw.tweetId !== null)
      : [];

    let tweets = rows.map((tweet) => {
      return (
        <TweetRow
          key={ tweet.rtId }
          photo={ tweet.photo }
          username={ tweet.username }
          name={ tweet.name }
          location={ tweet.location }
          followers={ tweet.followers }
          id={ tweet.tweetId }
          rtId={ tweet.rtId }
        />
      );
    });

    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Photo de profil</th>
            <th>Username</th>
            <th>Nom</th>
            <th>Lieu</th>
            <th>Followers</th>
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
