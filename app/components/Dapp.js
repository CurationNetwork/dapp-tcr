import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';

import BlockTabs from './tabs/BlockTabs';
import ItemForm from './forms/ItemForm';
import ButtonAddDapp from './common/ButtonAddDapp';
{/*
  import BlockSubmitted from './blocks/BlockSubmitted';
  import BlockChallengedRemove from './blocks/BlockChallengedRemove';
  import BlockChallengedUpdate from './blocks/BlockChallengedUpdate';
  import BlockRegistry from './blocks/BlockRegistry';
*/}

import './Dapp.scss';
import logo from '../assets/logo-horisontal.svg';

function Main ({location}) {
  
  if (/form=1/.test(location.search)) {
    return (<ItemForm/>);

  } else {
    return (<div className="dapp-container">
      <div className="top-line">
        <div className="logo">
          <img src={logo}/>
          <div>Token curated DApp registry</div>
        </div>
        <div className="add-buttin"><ButtonAddDapp/></div>
      </div>
      
      <BlockTabs/>
      {/* 
        <BlockSubmitted/>
        <BlockChallengedUpdate/>
        <BlockChallengedRemove/>
        <BlockRegistry/>
      */}
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
