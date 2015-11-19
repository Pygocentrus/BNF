// Packages
import React, { Component, PropTypes } from 'react';
import { Col, Button, Glyphicon } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules
import Conf from '../../../conf/conf';
import DashboardActions from '../../../actions/DashboardActions';

let socket = io.connect(Conf.socketHost);

class TweetComponent extends Component {

  constructor(props) {
    super(props);

    this._handleRemove = this._handleRemove.bind(this);
  }

  render() {

    return (
      <Col xs={12} md={6}>
        <blockquote className="twitter-tweet" lang="fr">
          <a href={ this.props.link }></a>
        </blockquote>

        <Button
          data-tweetid={ this.props.id }
          onClick={ this._handleRemove }
          bsStyle="danger">
          <Glyphicon glyph="chevron-up" />&nbsp;Supprimer
        </Button>
      </Col>
    );

  }

  _handleRemove() {
    DashboardActions.removeTweet({ tweet: this.props.id });
  }

}

export default TweetComponent;
