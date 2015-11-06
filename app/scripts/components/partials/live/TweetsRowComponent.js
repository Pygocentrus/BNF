// Packages
import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

// Modules
import Utils from '../../../mixins/utils';
import LivestreamActions from '../../../actions/LivestreamActions';
import BnfQueueActions from '../../../actions/BnfQueueActions';

class TweetsRowComponent extends Component {

  constructor(props) {
    super(props);

    // Utils
    this._linkToUser = this._linkToUser.bind(this);
    this._linkToOriginalPost = this._linkToOriginalPost.bind(this);
    this._cleanLocation = this._cleanLocation.bind(this);

    // Action handlers
    this._handleValidate = this._handleValidate.bind(this);
    this._handleReject = this._handleReject.bind(this);
    this._handleCancel = this._handleCancel.bind(this);

    // Dynamic UI components
    this._actionsLive = this._actionsLive.bind(this);
    this._actionsQueue = this._actionsQueue.bind(this);
  }

  render() {

    let btn;

    switch (this.props.actionsType) {
      case 'queue':
        btn = this._actionsQueue();
        break;
      case 'live':
      default:
        btn = this._actionsLive();
    }

    return (
      <tr>
        <td><img src={ this.props.photo }/></td>
        <td>{ this._linkToUser(this.props.username) }</td>
        <td>{ this.props.name }</td>
        <td>{ this._cleanLocation(this.props.location) }</td>
        <td>{ this.props.followers }</td>
        <td>{ this._linkToOriginalPost(this.props.link) }</td>
        { btn }
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

  _handleCancel() {
    BnfQueueActions.cancelDisplay({ retweet: this.props.rtId });
  }

  _actionsLive() {
    return (
      <td>
      <Button
        onClick={ this._handleValidate }
        bsStyle="success">
        Valider
      </Button>
      &nbsp;&nbsp;
      <Button
        onClick={ this._handleReject }
        bsStyle="danger">
        Refuser
      </Button>
      </td>
    );
  }

  _actionsQueue() {
    return (
      <td>
        <Button
          bsStyle="danger"
          onClick={ this._handleCancel }>
          Annuler
        </Button>
      </td>
    );
  }

}

export default TweetsRowComponent;
