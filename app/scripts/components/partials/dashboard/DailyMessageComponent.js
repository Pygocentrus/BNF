// Packages
import React, { Component, PropTypes } from 'react';
import io from 'socket.io-client';
import { Input, Button, Panel } from 'react-bootstrap';

// Modules
import Conf from '../../../conf/conf';
import DailyPhotoMessageStore from '../../../stores/DailyPhotoMessageStore';
import DailyPhotoMessageActions from '../../../actions/DailyPhotoMessageActions';
import dailyPhotoMessageApi from '../../../api/dailyPhotoMessageApi';

// Socket io Instance
let socket = io.connect(Conf.socketHost, { secure: false, port: 8080 });

let getRewteetsState = () => {
  let message = DailyPhotoMessageStore.getDailyPhotoMessage();

  return {
    messageValue: message.content || ''
  };
};

class DailyMessageComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageValue: ''
    };

    this._onChange = this._onChange.bind(this);
    this._handleMessageChange = this._handleMessageChange.bind(this);
    this._handleClickNew = this._handleClickNew.bind(this);
  }

  componentDidMount() {
    // Listen to the store
    DailyPhotoMessageStore.addChangeListener(this._onChange);

    // Fetch data from the server
    dailyPhotoMessageApi.getLatestMessage();
  }

  componentWillUnmount() {
    // Stop listening to the store
    DailyPhotoMessageStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('dashboard:daily-photo-msg:latest');
    socket.removeAllListeners('dashboard:daily-photo-msg:new');
    socket.removeAllListeners('dashboard:daily-photo-msg:update');
  }

  render() {

    return (
      <Panel header="Modification du message du jour sur la BNF" bsStyle="warning">

        <div>
          Exemple de message:
          <blockquote>
            <p>"RT sur @wild_touch et découvrez l'expédition #WildTouchExpeditions"</p>
          </blockquote>
        </div>

        <Input
          type="textarea"
          value={ this.state.messageValue }
          placeholder="Message du jour à faire apparaître sur la BNF"
          ref="message"
          onChange={ this._handleMessageChange }
        />

        <Button
          bsStyle="primary"
          onClick={ this._handleClickNew }>
          Ajouter ou modifier le message
        </Button>
      </Panel>
    );

  }

  _onChange() {
    this.setState(getRewteetsState());
  }

  _handleMessageChange(data) {
    // Get the input's content
    this.setState({
      messageValue: this.refs.message.getValue()
    });
  }

  _handleClickNew() {
    // If we have a message that came from the server,
    // let's update it
    if (DailyPhotoMessageStore.containsMessage()) {
      DailyPhotoMessageActions.updateLatestMessage({
        message: this.state.messageValue
      });
    } else {
      // Otherwise, we create one from scratch out of the content
      DailyPhotoMessageActions.newLatestMessage({ message: this.state.messageValue });
    }
  }

}

export default DailyMessageComponent;
