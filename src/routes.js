import React from 'react';
import { Route } from 'react-router-dom';

import App from './components/App';
import Login from './components/Login';
import Overview from './components/Overview';

const Routes = () => (
  <App>
    <Route exact path="/" component={Login} />
    <Route path="/overview" component={Overview} />
  </App>
);

export default Routes;
