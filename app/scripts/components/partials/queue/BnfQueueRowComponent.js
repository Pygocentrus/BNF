// Packages
import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

// Modules
import Utils from '../../../mixins/utils';
import BnfQueueActions from '../../../actions/BnfQueueActions';

class TweetsRowComponent extends Component {

  constructor(props) {
    super(props);

    this._linkToUser = this._linkToUser.bind(this);
    this._linkToOriginalPost = this._linkToOriginalPost.bind(this);
    this._cleanLocation = this._cleanLocation.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
  }

  render() {

    return (
      <tr>
        <td><img src={ this.props.photo }/></td>
        <td>{ this._linkToUser(this.props.username) }</td>
        <td>{ this.props.name }</td>
        <td>{ this._linkToOriginalPost(this.props.link) }</td>
        <td>
          <Button
            bsStyle="danger"
            onClick={ this._handleCancel }>
            Annuler
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

  _handleCancel() {
    BnfQueueActions.cancelDisplay(this.props.rtId);
  }

}

export default TweetsRowComponent;
