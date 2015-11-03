// Packages
import React, { Component, PropTypes } from 'react';
import { Col } from 'react-bootstrap';

class TweetComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Col xs={12} md={6}>
        <blockquote className="twitter-tweet" lang="fr">
          <a href={ this.props.link }></a>
        </blockquote>
      </Col>
    );

  }

}

export default TweetComponent;
