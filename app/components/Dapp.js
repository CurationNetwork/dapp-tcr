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
import {afterInit, Contract} from "../helpers/eth";
import axios from 'axios';
//
// function Main ({location}) {
//
//   if (/form=1/.test(location.search)) {
//     return (<ItemForm/>);
//
//   } else {
//     return (<div className="dapp-container">
//       <div className="top-line">
//         <div className="logo">
//           <img src={logo}/>
//           <div>Token curated DApp registry</div>
//         </div>
//         <div className="add-buttin"><ButtonAddDapp/></div>
//       </div>
//
//       <BlockTabs/>
//       {/*
//         <BlockSubmitted/>
//         <BlockChallengedUpdate/>
//         <BlockChallengedRemove/>
//         <BlockRegistry/>
//       */}
//     </div>);
//   }
// }

const browserHistory = createBrowserHistory();

class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.interval = null;
  }

  componentWillMount() {
    this.fetch_data();

    this.interval = setInterval(() => {
      this.fetch_data();
    }, 30 * 1000);
  }

  // componentWillUnmount() {
  //   if (this.interval) {
  //     clearInterval(this.interval);
  //     this.interval = null;
  //   }
  // }

  fetch_data() {
    afterInit.then(() => {
      let contract = Contract('Registry');

      let list = null;

      contract.call('list')
        .then(ids => {
          return Promise.all(ids.map(id => {
            return contract.call('get_info', [id])
          }))
        })
        .then(res => {
          list = res;
          return Promise.all(list.map(item => {
            return axios.get('https://ipfs.io' + '/ipfs/' + Buffer.from(item[3].substr(2), 'hex').toString())
          }))
        })
        .then(res => {
          res.forEach((data, idx) => {
            list[idx].ipfs_data = data;
          });

          this.setState({list: list})
        });
    });
  }

  render() {
    return (<Router history={browserHistory}>
      <Switch>
        <Route path="/" render={(props) => (
          <div className="dapp-container">
            <div className="top-line">
              <div className="logo">
                <img src={logo}/>
                <div>Token curated DApp registry</div>
              </div>
              <div className="add-buttin"><ButtonAddDapp/></div>
            </div>

            <BlockTabs data={this.state.list}/>
          </div>)}/>
      </Switch>
    </Router>);
  }
}

export default Dapp;
