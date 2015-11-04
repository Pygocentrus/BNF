// Packages
import React, { Component, PropTypes } from 'react';
import { Table, Row, Button } from 'react-bootstrap';

class TweetsRowComponent extends Component {

  constructor(props) {
    super(props);

    this._handleValidate = this._handleValidate.bind(this);
    this._handleReject = this._handleReject.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {

    return (
      <tr>
        <td><img src={ this.props.photo }/></td>
        <td>{ this.props.username }</td>
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

  _handleValidate() {
    console.log('Validate', this.props.id);
  }

  _handleReject() {
    console.log('Reject', this.props.id);
  }

}

export default TweetsRowComponent;
