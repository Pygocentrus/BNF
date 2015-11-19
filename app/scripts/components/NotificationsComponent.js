// Packages
import React from 'react';
import { Alert } from 'react-bootstrap';

// Modules
import AppDispatcher from '../dispatchers/AppDispatcher';
import GlobalConstants from '../constants/GlobalConstants';

class NotificationsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      alertVisible: false,
      type: 'success',
      message: ''
    };

    this._onChange = this._onChange.bind(this);
    this._handleAlertDismiss = this._handleAlertDismiss.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    AppDispatcher.register((payload) => {
      let action = payload.action;

      switch(action.actionType) {
        case GlobalConstants.NOTIFICATION_SHOW:
          this._onChange(action.notification);
          break;
        default:
          return true;
      }
      return true;
    });
  }

  render() {
    if (this.state.alertVisible) {
      return (
        <div className="container">
          <Alert bsStyle={ this.state.type } onDismiss={ this._handleAlertDismiss } dismissAfter={ 3000 }>
            { this.state.message }
          </Alert>
        </div>
      );
    } else {
      return <div className="container"></div>;
    }
  }

  _handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  _onChange(notification) {
    this.setState({
      alertVisible: true,
      type: notification.type || 'success',
      message: notification.message || ''
    });
  }

}

export default NotificationsComponent;
