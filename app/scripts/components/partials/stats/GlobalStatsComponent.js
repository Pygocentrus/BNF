import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import _ from 'lodash';

class GlobalStatsComponent extends React.Component {

  constructor(props) {
    super(props);

    this._validatedRetweets = this._validatedRetweets.bind(this);
    this._rejectedRetweets = this._rejectedRetweets.bind(this);
    this._displayedRetweets = this._displayedRetweets.bind(this);
    this._awaitingRetweets = this._awaitingRetweets.bind(this);
    this._awaitingQueueRetweets = this._awaitingQueueRetweets.bind(this);
  }

  render() {
    return (
      <div>
        <h2>Données générales</h2><hr />

        <ListGroup>
          <ListGroupItem>Nombre total de retweets enregistrés: { this.props.data.length }</ListGroupItem>
          <ListGroupItem>Retweets validés: { this._validatedRetweets(this.props.data) }</ListGroupItem>
          <ListGroupItem>Retweets rejectés: { this._rejectedRetweets(this.props.data) }</ListGroupItem>
          <ListGroupItem>Retweets affichés: { this._displayedRetweets(this.props.data) }</ListGroupItem>
          <ListGroupItem>Retweets en attente d'affichage: { this._awaitingQueueRetweets(this.props.data) }</ListGroupItem>
          <ListGroupItem>Retweets en attente de validation: { this._awaitingRetweets(this.props.data) }</ListGroupItem>
        </ListGroup>
      </div>
    );
  }

  _validatedRetweets(data) {
    return data.filter((rt) => rt.isValid).length;
  }

  _rejectedRetweets(data) {
    return data.filter((rt) => !rt.isValid).length;
  }

  _displayedRetweets(data) {
    return data.filter((rt) => rt.hasBeenDisplayed).length;
  }

  _awaitingQueueRetweets(data) {
    return data.filter((rt) => rt.isValid && !rt.hasBeenDisplayed).length;
  }

  _awaitingRetweets(data) {
    return data.filter((rt) => !rt.hasBeenValidated).length;
  }

}

export default GlobalStatsComponent;
