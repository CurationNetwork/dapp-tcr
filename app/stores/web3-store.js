import { action, observable, runInAction } from 'mobx';

import { getNetworkName } from '../helpers/eth-tools';

export default class Web3Store {
  @observable web3;
  @observable contracts;
  @observable web3Status;
  @observable networkId;
  @observable defaultAccount;

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.checkWeb3Status = this.checkWeb3Status.bind(this);
    this.initWeb3 = this.initWeb3.bind(this);
    this.checkNetwork = this.checkNetwork.bind(this);
    this.checkDefaultAccount = this.checkDefaultAccount.bind(this);

    window.addEventListener('load', () => {
      this.checkWeb3Status();
      this.interval1 = setInterval(() => {
        this.checkWeb3Status();
      }, 200);
    });
  }

  @action
  /** 
   * Checks window.web3 object status changes by time interval,
   * initializes contracts and subscriptions.
   */
  checkWeb3Status() {
    let s = this.web3Status;

    if (this.web3 && typeof this.web3 === 'object') s = 'web3-ok';
    if (this.web3 === 'not-authorized') s = 'web3-not-authorized';
    if (window.web3 && !window.web3.eth.defaultAccount) s = 'web3-locked';
    if (!window.Web3) s = 'no-web3';

    if (s !== this.web3Status) {
      console.log('web3Status: ' + this.web3Status + ' -> ' + s);
      this.web3Status = s;
      this.initWeb3();
    }

    if (s === 'web3-ok') {
      this.checkNetwork();
      this.checkDefaultAccount();

      const {contracts, initContracts} = this.rootStore.contractsStore;
      if (!contracts.size) initContracts();

      const {blockSubscription, initSubscription} = this.rootStore.subscriptionsStore;
      if (!blockSubscription) initSubscription();
      
    }
  }

  @action
  /** Gets web3 provider from environment and bring web3 to work. */
  initWeb3() {
    if (!this.web3 && window.ethereum) {
      window.ethereum.enable()
        .then(() => {
          runInAction(() => {        
            this.web3 = new window.Web3(window.ethereum);
          });
        })
        .catch(() => this.web3 = 'not-authorized');      
  
    } else if (!this.web3 && window.web3) {
      this.web3 = new window.Web3(window.web3.currentProvider);
  
    }
  }

@action
  checkNetwork() {
    this.web3.version.getNetwork((err, netId) => {
      if (netId && this.networkId !== netId) {
        console.log(
          'networkId: ' + getNetworkName(this.networkId) + ' -> ' + getNetworkName(netId)
        );
        this.networkId = netId;
      }
    });
  }

  @action
  checkDefaultAccount() { 
    if (this.defaultAccount !== window.web3.eth.defaultAccount) {
      console.log('defaultAccount: ' + this.defaultAccount + ' -> ' + window.web3.eth.defaultAccount);
      this.defaultAccount = window.web3.eth.defaultAccount;
    }
  }


}
