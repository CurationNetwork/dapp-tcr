import { action, observable, runInAction } from 'mobx';

import contractsConfig from '../contracts';

export default class ContractsStore {
  @observable contracts = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.setContracts = this.setContracts.bind(this);
    this.isContractReady = this.isContractReady.bind(this);
  }

  @action
  // TODO: generate named functions for contract methods
  setContracts() {
    const { web3, isWeb3Available } = this.rootStore.web3Store;
    if (!isWeb3Available()) {
      console.error('Bad web3 status, contracts not initialized.');
      return;
    }

    if (this.contracts.size) { // init once
      return;
    }
    
    const that = this;
    Object.keys(contractsConfig).forEach((name) => {
      this.contracts.set(name, {
        ...contractsConfig[name],
        instance: web3.eth.contract(contractsConfig[name].abi).at(contractsConfig[name].address),
        call: function(method, args = []) {
          return new Promise((resolve, reject) => {
            this.instance[method](...args, (err, res) => {
              err ? reject(err) : resolve(res);
            });
          });
        },
        send: function(method, args = []) {
          return new Promise((resolve, reject) => {
            this.instance[method](...args, (err, txHash) => {
              if (err) {
                reject(err)
              } else if (txHash) {                  
                that.rootStore.transactionsStore.setTransaction(txHash);
                resolve(txHash);
              }
            });
          });
        },
      });
    });
  }

  isContractReady(contractName, fName = undefined) {
    const { isWeb3Available } = this.rootStore.web3Store;
    const { contracts } = this.rootStore.contractsStore;

    const isReady = isWeb3Available() && contracts && contracts.has(contractName);
    if (!isReady && fName) {
      console.log(`parametrizerStore.${fName} failed`);
    }

    return isReady;
  }

}
