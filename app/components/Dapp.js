import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';

import BlockSubmitted from './blocks/BlockSubmitted';
import BlockChallengedRemove from './blocks/BlockChallengedRemove';
import BlockChallengedUpdate from './blocks/BlockChallengedUpdate';
import BlockRegistry from './blocks/BlockRegistry';
import ItemForm from './forms/ItemForm';

import './Dapp.scss';

function Main ({location}) {
  
  if (/form=1/.test(location.search)) {
    return (<ItemForm/>);

  } else {
    return (<div className="dapp-container">
      <BlockSubmitted/>
      <BlockChallengedUpdate/>
      <BlockChallengedRemove/>
      <BlockRegistry/>
    </div>);
  }
}

const browserHistory = createBrowserHistory();

class Dapp extends React.Component {
  render() {
    return (<Router history={browserHistory}>
      <Switch>
        <Route path="/" component={Main}/>
      </Switch>
    </Router>);
  }
}

export default Dapp;
