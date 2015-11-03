// Packages
import React from 'react';
import Router, { Route, IndexRoute, RouteHandler } from 'react-router';
import _ from 'lodash';

// Components
import HeaderComponent from './HeaderComponent';

// Utils
import Utils from '../mixins/utils';

class AppComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    // var data = this.getData();
    var data = {
      dailyTweets: [
        { id: 1, link: "https://twitter.com/wild_touch/status/660064048923418624" },
        { id: 2, link: "https://twitter.com/wild_touch/status/660064048923418624" },
        { id: 3, link: "https://twitter.com/wild_touch/status/660064048923418624" }
      ]
    };

    this.setState(data);
  }

  render() {
    return (
      <div className="wrapper">
        <HeaderComponent/>
        { React.cloneElement(this.props.children, { data: this.state })}
      </div>
    )
  }

}

export default AppComponent;
