import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// import all the necessary Components
import NoResultsFound from '../components/NoResultsFound';
import Exchange from '../components/Exchange';
import Navbar from '../components/Navbar';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div className="app-container">
          <div className="nav-bar">
            <Navbar />
          </div>
          <Route exact path="/">
            <Redirect to="/dashboard/exchange" />
          </Route>
          <Route exact path="/dashboard">
            <Redirect to="/dashboard/exchange" />
          </Route>
          <Switch>
            <Route exact path='/dashboard/exchange' component={Exchange} />
            <Route exact path='/dashboard/orders' component={NoResultsFound} />
            <Route exact path='/dashboard/track' component={NoResultsFound} />
            <Route exact path='/dashboard/products' component={NoResultsFound} />
            <Route exact path='/dashboard/refer' component={NoResultsFound} />
        </Switch>
        </div>
      </Router>
    );
  }
}

export default Routes;
