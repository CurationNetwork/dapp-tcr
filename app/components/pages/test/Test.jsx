import React from 'react';
import { inject, observer } from 'mobx-react';

import Tabs from '../../tabs/Tabs';
import ButtonAddDapp from '../../common/ButtonAddDapp';

import logo from '../../../assets/logo-horisontal.svg';

@inject('stores')
@observer
export default class Test extends React.Component {
  componentWillMount() {
    const { list, fetchRegistry } = this.props.stores.tcrStore;

    if (!list.length) {
      fetchRegistry();      
    }

    this.props.stores.subscriptionsStore.subscribe('tcrStore', 'fetchRegistry');
  }

  render() {
    const { list } = this.props.stores.tcrStore;

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
        <Tabs data={list}/>
      </div>
    );
  }
}
