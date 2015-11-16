import React from 'react';
import Highcharts from 'react-highcharts/dist/bundle/highcharts';
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';

class RewteetsStatsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this._orderByDate = this._orderByDate.bind(this);
    this._groupByDate = this._groupByDate.bind(this);
    this._counterForEachDate = this._counterForEachDate.bind(this);
    this._getDates = this._getDates.bind(this);
  }

  render() {
    let orderedRts = this._orderByDate(this.props);
    let groupedRts = this._groupByDate(orderedRts);

    let config = {
      credits: {
        enabled: false
      },
      title: {
        text: null
      },
      xAxis: {
        categories: this._getDates(groupedRts)
      },
      series: [{
        data: this._counterForEachDate(groupedRts)
      }]
    };

    return (
      <div>
        <h2>Répartition des retweets validés par date</h2><hr />

        <ReactHighcharts config={ config } ref="chart"></ReactHighcharts>
      </div>
    );
  }

  _orderByDate(elements) {
    return elements.data.sort((rt1, rt2) => {
      if (rt1.date < rt2.date) {
        return -1;
      } else if (rt1.date > rt2.date) {
        return 1;
      }
      return 0;
    });
  }

  _groupByDate(retweets) {
    let dates = {};

    _.forEach(retweets, (rt) => {
      let rtDate = new Date(rt.date);

      let formatedDate = [
        rtDate.getUTCFullYear(),
        "/",
        rtDate.getUTCMonth() + 1,
        "/",
        rtDate.getUTCDate()
      ].join('');

      // Create the daily key if it doesn't exist yet
      if (!_.has(dates, formatedDate)) {
        dates[formatedDate] = [];
      }

      dates[formatedDate].push(rt);
    });

    return dates;
  }

  _getDates(dates) {
    return _.keys(dates);
  }

  _counterForEachDate(dates) {
    return _.values(dates).map((rts) => rts.length);
  }

}

export default RewteetsStatsComponent;
