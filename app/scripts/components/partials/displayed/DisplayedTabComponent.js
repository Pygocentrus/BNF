// Packages
import React, { Component, PropTypes } from 'react';
import { Table, Row } from 'react-bootstrap';

// Single tweet card
import DisplayedRowComponent from './DisplayedRowComponent';
import Utils from '../../../mixins/utils';

class DisplayedTabComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {

    let rows = this.props.displayedTweets.length
      ? this.props.displayedTweets.filter((tw) => tw && tw.tweetId !== null)
      : [];

    let tweets = rows.map((tweet) => {
      return (
        <DisplayedRowComponent
          key={ Utils.generateUniqueKey(tweet.rtId) }
          photo={ tweet.photo }
          bnfPhoto={ tweet.bnfPhoto }
          username={ tweet.username }
          name={ tweet.name }
          location={ tweet.location }
          followers={ tweet.followers }
          hasBeenReplied={ tweet.hasBeenReplied }
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
            <th>Nom d'utilisateur</th>
            <th>Nom</th>
            <th>Lieu</th>
            <th>Followers</th>
            <th>Post</th>
            <th>Photo BNF ?</th>
            <th>Répondu ?</th>
          </tr>
        </thead>
        <tbody>
          { tweets }
        </tbody>
      </Table>
    );

  }

}

export default DisplayedTabComponent;
