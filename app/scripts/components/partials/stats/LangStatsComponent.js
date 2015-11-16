import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';
import HighCharts from 'react-highcharts/dist/bundle/highcharts';
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';

class LangStatsComponent extends React.Component {

  constructor(props) {
    super(props);

    this._groupByLang = this._groupByLang.bind(this);
    this._getPercents = this._getPercents.bind(this);
    this._finalWrap = this._finalWrap.bind(this);
  }

  render() {
    let groupedRts = this._groupByLang(this.props.data);
    let percents = this._getPercents(groupedRts);

    let config = {
      credits: {
        enabled: false
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: null
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        name: 'Pourcentage',
        data: this._finalWrap(percents)
      }]
    };

    return (
      <div>
        <h2>Répartition totale de la langue pour les { this.props.data.length } retweets validés</h2><hr />

        <ReactHighcharts config={ config } ref="chart"></ReactHighcharts>
      </div>
    );
  }

  _groupByLang(retweets) {
    let languages = {};

    _.forEach(retweets, (rt) => {
      // Create the daily key if it doesn't exist yet
      if (!_.has(languages, rt.lang)) {
        languages[rt.lang] = [];
      }

      languages[rt.lang].push(rt);
    });

    return languages;
  }

  _getPercents(retweets) {
    // Get the number of tweets per lang
    let totalCounterPerLang = _.mapValues(retweets, (rts) => rts.length);
    // Count the total of tweets, all languages merged
    let totalCounter = _.values(totalCounterPerLang)
      .reduce((prev, next) => { return prev + next }, 0);

    // Return each percent per language
    return _.mapValues(retweets, (rts) => {
      let rawPercent = rts.length * 100 / totalCounter;
      // Round to decimal
      return Math.round(rawPercent * 100) / 100 ;
    });
  }

  _finalWrap(retweets) {
    let data = [];

    // Format each language for highcharts
    _.forIn(retweets, (value, key) => {
      data.push({
        name: key,
        y: value
      });
    });

    return data;
  }

}

export default LangStatsComponent;
