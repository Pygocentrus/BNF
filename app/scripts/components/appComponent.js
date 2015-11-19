// Packages
import React from 'react';
import Router, { Route, IndexRoute, RouteHandler } from 'react-router';
import _ from 'lodash';

// Components
import HeaderComponent from './HeaderComponent';
import NotificationsComponent from './NotificationsComponent';

// Utils
import Utils from '../mixins/utils';

class AppComponent extends React.Component {

  constructor() {
    super();
  }

  componentWillMount() {}

  render() {
    return (
      <div className="wrapper">
        <HeaderComponent />
        <NotificationsComponent />
        { this.props.children }
      </div>
    )
  }

}

export default AppComponent;
