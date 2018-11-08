import { action, observable, runInAction } from 'mobx';

import { web3Init } from '../helpers/eth-web3';
import { initContracts as initC } from '../helpers/eth-contracts';
import contractsConfig from '../contracts';

export default class AppStore {
  @observable web3 = null;
  @observable contracts = null;

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.initWeb3 = this.initWeb3.bind(this);
    this.initContracts = this.initContracts.bind(this);
  }

  @action
  initWeb3() {
    web3Init.then((w3) => {
      runInAction(() => {        
        this.web3 = w3;
      });

      this.initContracts();
    })
  }

  @action
  initContracts() {
    initC(this.web3, contractsConfig).then((cs) => {
      runInAction(() => {        
        this.contracts = cs;
      });  
    });
  }
}
