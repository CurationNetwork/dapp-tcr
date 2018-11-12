import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';

import Stores from '../stores';
import Main from './pages/main/Main';

import './Dapp.scss';

export default class Dapp extends React.Component {
  render() {
    return (
      <Provider stores={Stores}>
        <Router history={syncHistoryWithStore(createBrowserHistory(), Stores.router)}>
          <Switch>
            <Route path="/" exact={true} component={Main}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
