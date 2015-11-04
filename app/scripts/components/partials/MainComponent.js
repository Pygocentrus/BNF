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
  }

  componentWillMount() {
    this.setState({
      dailyTweets: this.props.data.dailyTweets,
      newTweetValue: ''
    });

    DailyTweetStore.loadDailyTweets(this.props.data.dailyTweets);
  }

  componentDidMount() {
    // Watch changes from the store
    DailyTweetStore.addChangeListener(this._onChange);

    // Reload the Twitter widget
    this._reloadTwitterWidget();

    socket.emit('dashboard:daily-tweets:all');

    socket.on('dashboard:daily-tweets:all', (data) => {
      console.log('Daily tweets: ', data);
    });
  }

  componentDidUpdate() {
    this._reloadTwitterWidget();
  }

  componentWillUnmount() {
    DailyTweetStore.removeChangeListener(this._onChange);
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
            placeholder="URL du tweet (ex: https://twitter.com/wild_touch/status/660064048923418624)"
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

}

export default MainComponent;
