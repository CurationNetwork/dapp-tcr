import { action, observable, runInAction } from 'mobx';

import { getNetworkName } from '../helpers/eth-tools';

/**  */
export default class Web3Store {
  @observable web3;
  @observable web3Status;
  @observable networkId;
  @observable defaultAccount;

  WEB3_CHECK_INTERVAL = 200;
  WEB3_STATUS = Object.freeze({
    OK: 'web3 OK',
    NOT_AUTH: 'web3 not authorized',
    LOCKED: 'web3 locked',
    NO: 'web3 not found',
  });

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.isDependentsSet = false;

    this.checkWeb3Status = this.checkWeb3Status.bind(this);
    this.initWeb3 = this.setWeb3.bind(this);
    this.checkNetwork = this.setNetwork.bind(this);
    this.checkDefaultAccount = this.setDefaultAccount.bind(this);
    this.setDependents = this.initDepencies.bind(this);
    this.isWeb3Available = this.isWeb3Available.bind(this);

    window.addEventListener('load', () => {
      this.checkWeb3Status();
      this.web3CheckInterval = setInterval(() => {
        this.checkWeb3Status();
      }, this.WEB3_CHECK_INTERVAL);
    });
  }

  @action
  /** 
   * Checks window.web3 object status changes by time interval,
   * initializes contracts and subscriptions.
   */
  checkWeb3Status() {
    let { web3Status } = this;
    const { WEB3_STATUS } = this;

    if (!this.web3 && (window.ethereum || window.web3)) {
      this.setWeb3();
    }

    if (this.web3 && typeof this.web3 === 'object') {
      web3Status = WEB3_STATUS.OK;
    } else if (this.web3 === 'not-authorized') {
      web3Status = WEB3_STATUS.NOT_AUTH;
    }
    if (window.web3 && !window.web3.eth.defaultAccount) {
      web3Status = WEB3_STATUS.LOCKED;
    } else if (!window.web3) {
      web3Status = WEB3_STATUS.NO;
    }

    if (web3Status !== this.web3Status) {
      console.log('web3Status: ' + this.web3Status + ' -> ' + web3Status);
      this.web3Status = web3Status;
    }

    if (web3Status === WEB3_STATUS.OK) {
      // Cyclic wallet status check
      this.setNetwork();
      this.setDefaultAccount();

      // One-time Web3 dependencies state init
      if (!this.isDependentsSet) {
        this.initDepencies();
      }
    }
  }

  @action
  /** Gets web3 provider by method depending on environment, setsWeb3. */
  setWeb3() {
    if (window.ethereum) {
      window.ethereum.enable()
        .then(() => {
          runInAction(() => {        
            this.web3 = new window.Web3(window.ethereum);
          });
        })
        .catch(() => this.web3 = WEB3_STATUS.NOT_AUTH);      
  
    } else if (window.web3) {
      this.web3 = new window.Web3(window.web3.currentProvider);
    }
  }

  @action
  setNetwork() {
    this.web3.version.getNetwork((e, netId) => {
      if (netId && this.networkId !== netId) {
        console.log(
          'networkId: ' + getNetworkName(this.networkId) + ' -> ' + getNetworkName(netId)
        );
        runInAction(() => {
          this.networkId = netId;
        });
      }
    });
  }

  @action
  setDefaultAccount() { 
    if (this.defaultAccount !== window.web3.eth.defaultAccount) {
      console.log('defaultAccount: ' + this.defaultAccount + ' -> ' + window.web3.eth.defaultAccount);
      this.defaultAccount = window.web3.eth.defaultAccount;
    }
  }

  /** Web3-depending state init */
  initDepencies() {    
    // contracts ABI load
    this.rootStore.contractsStore.setContracts();

    // TCR contract listings data and states
    this.rootStore.tcrStore.fetchRegistry();

    // TCR parameters
    this.rootStore.parametrizerStore.fetchParameters();

    // subscriptions
    this.rootStore.subscriptionsStore.initSubscriptions();

    // subscriptions
    this.rootStore.tokenStore.fetchTokenInfo();

    this.isDependentsSet = true;
  }

  isWeb3Available() {
    const { web3Status, WEB3_STATUS } = this;
    return web3Status === WEB3_STATUS.OK;
  }

}
