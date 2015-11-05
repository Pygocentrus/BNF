// Packages
import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

// Modules
import Utils from '../../../mixins/utils';
import LivestreamActions from '../../../actions/LivestreamActions';

class TweetsRowComponent extends Component {

  constructor(props) {
    super(props);

    this._linkToUser = this._linkToUser.bind(this);
    this._linkToOriginalPost = this._linkToOriginalPost.bind(this);
    this._cleanLocation = this._cleanLocation.bind(this);
    this._handleValidate = this._handleValidate.bind(this);
    this._handleReject = this._handleReject.bind(this);
  }

  render() {

    return (
      <tr>
        <td><img src={ this.props.photo }/></td>
        <td>{ this._linkToUser(this.props.username) }</td>
        <td>{ this.props.name }</td>
        <td>{ this._cleanLocation(this.props.location) }</td>
        <td>{ this.props.followers }</td>
        <td>{ this._linkToOriginalPost(this.props.link) }</td>
        <td>
          <Button
            bsStyle="success"
            onClick={ this._handleValidate }>
            Valider
          </Button>
          &nbsp;&nbsp;
          <Button
            bsStyle="danger"
            onClick={ this._handleReject }>
            Refuser
          </Button>
        </td>
      </tr>
    );

  }

  _linkToUser(username) {
    let userLink = Utils.twitterUserLink(username);
    return (
      <a href={ userLink } target="_blank">@{ username }</a>
    );
  }

  _linkToOriginalPost(id) {
    let postLink = Utils.twitterPostLink(id);
    return (
      <a href={ postLink } target="_blank"><Glyphicon glyph="share" /></a>
    );
  }

  _cleanLocation(location) {
    return location ? location : '-';
  }

  _handleValidate() {
    LivestreamActions.validateRetweet(this.props.rtId);
  }

  _handleReject() {
    LivestreamActions.rejectRetweet(this.props.rtId);
  }

}

export default TweetsRowComponent;
