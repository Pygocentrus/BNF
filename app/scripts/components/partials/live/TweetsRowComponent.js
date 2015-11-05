// Packages
import React, { Component, PropTypes } from 'react';
import { Table, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class TweetsRowComponent extends Component {

  constructor(props) {
    super(props);

    this._linkToUser = this._linkToUser.bind(this);
    this._cleanLocation = this._cleanLocation.bind(this);
    this._handleValidate = this._handleValidate.bind(this);
    this._handleReject = this._handleReject.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {

    return (
      <tr>
        <td><img src={ this.props.photo }/></td>
        <td>{ this._linkToUser(this.props.username) }</td>
        <td>{ this.props.name }</td>
        <td>{ this._cleanLocation(this.props.location) }</td>
        <td>{ this.props.followers }</td>
        <td>
          <Button
            bsStyle="success"
            onClick={ this._handleValidate }>
            Valider
          </Button>&nbsp;

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
    let userLink = 'http://twitter.com/' + username;
    return (
      <a href={ userLink } target="_blank">@{ username }</a>
    );
  }

  _cleanLocation(location) {
    return location ? location : '-';
  }

  _handleValidate() {
    console.log('Validate', this.props.rtId);
  }

  _handleReject() {
    console.log('Reject', this.props.rtId);
  }

}

export default TweetsRowComponent;
