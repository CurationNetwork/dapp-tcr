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
