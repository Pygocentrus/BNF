// NPM
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import AppComponent from '../components/AppComponent';
import MainComponent from '../components/partials/MainComponent';
import LiveComponent from '../components/partials/LiveComponent';
import QueueComponent from '../components/partials/QueueComponent';
import DisplayedTweetsComponent from '../components/partials/DisplayedTweetsComponent';
import RejectedTweetsComponent from '../components/partials/RejectedTweetsComponent';
import StatsComponent from '../components/partials/StatsComponent';
import NotFoundComponent from '../components/partials/NotFoundComponent';

const history = createBrowserHistory({ queryKey: false });

let Routes = (
  <Router history={history}>
    <Route path="/" component={AppComponent} >
      <IndexRoute component={MainComponent} />
      <Route path="dashboard" component={MainComponent} />
      <Route path="live" component={LiveComponent} />
      <Route path="queue" component={QueueComponent} />
      <Route path="displayed" component={DisplayedTweetsComponent} />
      <Route path="rejected" component={RejectedTweetsComponent} />
      <Route path="stats" component={StatsComponent} />
      <Route path="*" component={NotFoundComponent}/>
    </Route>
  </Router>
);

export default Routes;
