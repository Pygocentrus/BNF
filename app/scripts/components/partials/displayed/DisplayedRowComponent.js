// Packages
import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

// Modules
import Utils from '../../../mixins/utils';
import LivestreamActions from '../../../actions/LivestreamActions';
import BnfQueueActions from '../../../actions/BnfQueueActions';

class DisplayedRowComponent extends Component {

  constructor(props) {
    super(props);

    // Utils
    this._linkToUser = this._linkToUser.bind(this);
    this._linkToOriginalPost = this._linkToOriginalPost.bind(this);
    this._cleanLocation = this._cleanLocation.bind(this);
    this._iconForRepliedStatus = this._iconForRepliedStatus.bind(this);
    this._iconForPictureStatus = this._iconForPictureStatus.bind(this);
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
        <td>{ this._iconForPictureStatus() }</td>
        <td>{ this._iconForRepliedStatus() }</td>
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

  _iconForPictureStatus() {
    if (!!this.props.bnfPhoto) {
      return (
        <a href={ this.props.bnfPhoto } target="_blank">
          <Glyphicon glyph="ok" />
        </a>
      );
    }
    return (
      <Glyphicon glyph="remove" />
    );
  }

  _iconForRepliedStatus() {
    if (!!this.props.hasBeenReplied) {
      return (
        <Glyphicon glyph="ok" />
      );
    }
    return (
      <Glyphicon glyph="remove" />
    );
  }

}

export default DisplayedRowComponent;
