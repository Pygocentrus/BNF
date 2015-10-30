// NPM
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import AppComponent from '../components/appComponent';
import MainComponent from '../components/mainComponent';
import LiveComponent from '../components/liveComponent';
import NotFoundComponent from '../components/notFoundComponent';

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
