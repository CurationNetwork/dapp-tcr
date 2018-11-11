import React from 'react';
import axios from 'axios';

import Tabs from './tabs/Tabs';
import ButtonAddDapp from './common/ButtonAddDapp';
import {afterInit, Contract} from "../../../helpers/eth";

import logo from '../../../assets/logo-horisontal.svg';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.interval = null;
  }

  componentWillMount() {
    this.fetch_data();
  }

  fetch_challenge_statuses() {
    let contract = Contract('Registry');

    let list = this.state.list;

    Promise.all(this.state.list.map(item => {
      if (item.isChallenged)
        return contract.call('challenge_status', [item.id]);
      else
        return null;
    })).then(res => {
      res.forEach((status, idx) => {
        if (status !== null) {
          list[idx].challengeStatus = {
            phase: status[1] === 0 ? 'commit' : 'reveal',
            challengeId: status[0],
            votesFor: status[3],
            votesAgainst: status[4],
            commitEndDate: status[5],
            revealEndDate: status[6]
          }
        }
        else {
          list[idx].challengeStatus = null;
        }
      });

      this.setState({list: list});
    });
  }

  fetch_data() {
    afterInit.then(() => {
      let contract = Contract('Registry');

      let list = null;
      let listIds = null;

      contract.call('list')
        .then(ids => {
          listIds = ids;
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

          const newList = list.map((l, i) => {
            const res = {};
            res.id = listIds[i];
            res.state = ['NOT_EXISTS', 'APPLICATION', 'EXISTS', 'EDIT', 'DELETING'][+l[0].toString()];
            res.isChallenged = l[1];
            res.canBeUpdated = l[2];
            res.ipfsHash = l[3];
            res.proposedIpfsHash = l[4];
            res.ipfsData = l.ipfs_data.data;
            return res;
          });

          this.state.list = newList;
          //this.setState({list: newList});
          this.fetch_challenge_statuses()
        });
    });
  }

  render() {
    return (
      <div className="dapp-container">
        <div className="top-line">
          <div className="logo">
            <img src={logo}/>
            <div>Token curated DApp registry</div>
          </div>
          <div className="add-button">
            <ButtonAddDapp/>
            <div className="faucet">
              <a href="https://smartz.io/dapp/0c45c585f27a6cfdeffd493c">DRT Rinkeby faucet</a>
            </div>
          </div>
        </div>
        <Tabs data={this.state.list}/>
      </div>
    );
  }
}
