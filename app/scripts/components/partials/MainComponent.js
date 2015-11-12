// Packages
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Input, Jumbotron, PageHeader, Grid, Row } from 'react-bootstrap';
import io from 'socket.io-client';
import _ from 'lodash';

// Components & modules
import Conf from '../../conf/conf';
import DailyTweetStore from '../../stores/DashboardDailyTweets';
import DailyTweetActions from '../../actions/DashboardActions';
import ListTweetsComponent from './dashboard/ListTweetsComponent';

// Socket io Instance
// let socket = io.connect(Conf.socketHost, { secure: false, port: 8080 });
let socket = io.connect(Conf.socketHost);

// Daily tweets update from the store
let getDailyTweetsState = () => {
  return {
    dailyTweets: DailyTweetStore.getAllDailyTweets()
  };
};

class MainComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};

    this._handleChange = this._handleChange.bind(this);
    this._handleClickNew = this._handleClickNew.bind(this);
    this._onChange = this._onChange.bind(this);
    this._reloadTwitterWidget = this._reloadTwitterWidget.bind(this);
    this._resetInputValue = this._resetInputValue.bind(this);
  }

  componentWillMount() {
    this._resetInputValue();

    // Ask for all daily tweets
    socket.emit('dashboard:daily-tweets:all');
    socket.on('dashboard:daily-tweets:all', (data) => {
      // Tell the dispatcher that we have fresh data to broadcast
      // all along the app
      DailyTweetActions.getDailyTweets(data);
    });

    // When a new tweet has been added to the backend
    socket.on('dashboard:daily-tweets:new', (data) => {
      this._resetInputValue();
    });
  }

  componentDidMount() {
    // Watch changes from the store
    DailyTweetStore.addChangeListener(this._onChange);

    // Reload the Twitter widget
    this._reloadTwitterWidget();
  }

  componentDidUpdate() {
    this._reloadTwitterWidget();
  }

  componentWillUnmount() {
    // Remove listeners on route change, preventing double bindings
    DailyTweetStore.removeChangeListener(this._onChange);
    socket.removeAllListeners('dashboard:daily-tweets:all');
  }

  render() {

    return (
      <section id="intro" className="container">
        {/* Simple page header */}
        <Jumbotron>
          <PageHeader>
            Opération BNF
          </PageHeader>
          <p>Interface d'administration</p>
        </Jumbotron>

        <h2>Ajout d'un nouveau tweet à surveiller:</h2><hr />

        {/* Form to add new daily tweets */}
        <div className="new-tweet">
          <Input
            type="text"
            value={ this.state.newTweetValue }
            placeholder="https://twitter.com/wild_touch/status/660064048923418624"
            ref="input"
            onChange={ this._handleChange } />
          <Button
            bsStyle="primary"
            onClick={ this._handleClickNew }>
            Ajouter un nouveau Tweet
          </Button>
        </div>

        <h2>Derniers tweets à surveiller:</h2><hr />

        {/* List of daily tweets */}
        <ListTweetsComponent ref="listTweets" dailyTweets={ this.state.dailyTweets } />
      </section>
    );

  }

  _onChange() {
    this.setState(getDailyTweetsState());
  }

  _handleChange() {
    // Get the input's content
    this.setState({
      newTweetValue: this.refs.input.getValue()
    });
  }

  _handleClickNew() {
    // Check whether the url is valid
    // DailyTweetStore.addDailyTweet(curURL);
    DailyTweetActions.addTweet(this.state.newTweetValue);
  }

  _reloadTwitterWidget() {
    // Re-scan the DOM to load Twitter cards again,
    // used when switching back to the dashboard
    if (twttr && twttr !== undefined) {
      twttr.widgets.load();
    }
  }

  _resetInputValue() {
    this.setState({ newTweetValue: '' });
  }

}

export default MainComponent;
