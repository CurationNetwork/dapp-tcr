import { action, observable, runInAction } from 'mobx';

import { getNetworkName } from '../helpers/eth-tools';

export default class Web3Store {
  @observable web3;
  @observable web3Status;
  @observable contracts;
  @observable networkId;
  @observable defaultAccount;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.dependentSet = false;

    this.checkWeb3Status = this.checkWeb3Status.bind(this);
    this.initWeb3 = this.setWeb3.bind(this);
    this.checkNetwork = this.setNetwork.bind(this);
    this.checkDefaultAccount = this.setDefaultAccount.bind(this);
    this.setDependents = this.setDependents.bind(this);

    window.addEventListener('load', () => {
      this.checkWeb3Status();
      this.intervalBlockCheck = setInterval(() => {
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

    if (s === undefined || s !== this.web3Status) {
      console.log('web3Status: ' + this.web3Status + ' -> ' + s);
      this.web3Status = s;
      this.setWeb3();
    }

    if (s === 'web3-ok') {
      // Cyclic wallet status check
      this.setNetwork();
      this.setDefaultAccount();

      // Web3-depending state init
      if (!this.dependentSet) {
        this.setDependents();
      }
    }
  }

  @action
  /** Gets web3 provider by method depending on environment, setsWeb3. */
  setWeb3() {
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
  setNetwork() {
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
  setDefaultAccount() { 
    if (this.defaultAccount !== window.web3.eth.defaultAccount) {
      console.log('defaultAccount: ' + this.defaultAccount + ' -> ' + window.web3.eth.defaultAccount);
      this.defaultAccount = window.web3.eth.defaultAccount;
    }
  }

  /** Web3-depending state init */
  setDependents() {    
    // contracts ABI
    const { contracts, setContracts } = this.rootStore.contractsStore;
    if (!contracts.size) setContracts();

    // TCR contract listings data and states
    const { registry, fetchRegistry } = this.rootStore.tcrStore;
    if (!registry.length) {
      fetchRegistry();
      this.rootStore.subscriptionsStore.subscribe('tcrStore', 'fetchRegistry');
    }

    // TCR parameters
    const { tcrParameters, fetchParameters } = this.rootStore.parametrizerStore;
    
    if (!tcrParameters.size) fetchParameters();

    // subscriptions
    const { blockInterval, initSubscription } = this.rootStore.subscriptionsStore; 
    if (!blockInterval) initSubscription();

    this.dependentSet = true;
  }


}
