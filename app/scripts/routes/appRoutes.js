// NPM
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import AppComponent from '../components/AppComponent';
import MainComponent from '../components/MainComponent';
import LiveComponent from '../components/LiveComponent';
import NotFoundComponent from '../components/NotFoundComponent';

const history = createBrowserHistory({ queryKey: false });

let Routes = (
  <Router history={history}>
    <Route path="/" component={AppComponent} >
      <IndexRoute component={MainComponent}/>
      <Route path="dashboard" component={MainComponent} />
      <Route path="live" component={LiveComponent} />
    </Route>
  </Router>
);

export default Routes;
