// NPM
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';

// Modules
import Conf from '../../conf/conf';
import RewteetsStatsComponent from './stats/RewteetsStatsComponent';
import LangStatsComponent from './stats/LangStatsComponent';
import GlobalStatsComponent from './stats/GlobalStatsComponent';

let socket = io.connect(Conf.socketHost);

class StatsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      retweets: []
    };

    this._handleData = this._handleData.bind(this);
    this._validRetweets = this._validRetweets.bind(this);
  }

  componentWillMount() {
    // Ask for all retweets data
    socket.emit('stats:retweets:all');
    socket.on('stats:retweets:all', (res) => {
      this._handleData(res.data);
    });
  }

  render() {
    return (
      <section id="bnf-queue" className="container">
        {/* Header */}
        <Jumbotron>
          <PageHeader>
            Statistiques
          </PageHeader>
          <p>Statistiques récoltées pendant la campagne</p>
        </Jumbotron>

        <GlobalStatsComponent data={ this.state.retweets } />
        <RewteetsStatsComponent data={ this._validRetweets(this.state.retweets) } />
        <LangStatsComponent data={ this._validRetweets(this.state.retweets) } />
      </section>
    );
  }

  _handleData(data) {
    this.setState({
      retweets: data
    });
  }

  _validRetweets(data) {
    return data.filter((rt) => rt.isValid === true);
  }

}

export default StatsComponent;
