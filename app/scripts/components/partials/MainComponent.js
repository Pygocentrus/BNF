// Packages
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Input, Jumbotron, PageHeader, Grid, Row } from 'react-bootstrap';
import _ from 'lodash';

import TweetComponent from './TweetComponent';

// TODO: Flux architecture
// import DashboardDailyTweets from '../stores/DashboardDailyTweets';

class MainComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setState({ newTweetValue: '' });
  }

  componentDidMount() {
    // Re-scan the DOM to load Twitter cards again,
    // used when switching back to the dashboard
    if (twttr) {
      twttr.widgets.load();
    }
  }

  render() {

    let dailyTweets = [];

    // Compose each Tweet cards in the grid
    if (this.props.parentState.dailyTweets) {
      dailyTweets = this.props.parentState.dailyTweets.map( (tweet) => {
        return <TweetComponent key={ tweet.id } link={ tweet.link }/>;
      });
    }

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
            onChange={ this.handleChange } />
          <Button bsStyle="primary">Ajouter un nouveau Tweet</Button>
        </div>

        {/* List of daily tweets */}
        <h2>Derniers tweets à surveiller:</h2><hr />

        <Grid>
          <Row className="show-grid">
            { dailyTweets }
          </Row>
        </Grid>
      </section>
    );

  }

  handleChange() {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    this.setState({
      newTweetValue: this.refs.input.getValue()
    });
  }

}

export default MainComponent;
