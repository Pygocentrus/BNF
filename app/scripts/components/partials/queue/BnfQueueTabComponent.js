// Packages
import React, { Component, PropTypes } from 'react';
import { Table, Row } from 'react-bootstrap';

// Single tweet card
import BnfQueueRowComponent from './BnfQueueRowComponent';
import Utils from '../../../mixins/utils';

class BnfQueueTabComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {

    let rows = this.props.bnfQueueTweets.length
      ? this.props.bnfQueueTweets.filter((tw) => tw && tw.tweetId !== null)
      : [];

    let tweets = rows.map((tweet) => {
      return (
        <BnfQueueRowComponent
          key={ Utils.generateUniqueKey(tweet.rtId) }
          photo={ tweet.photo }
          username={ tweet.username }
          name={ tweet.name }
          location={ tweet.location }
          followers={ tweet.followers }
          link={ tweet.originalTweetId }
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
            <th>Post</th>
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

export default BnfQueueTabComponent;
