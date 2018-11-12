import { action, observable, runInAction } from 'mobx';

import contractsConfig from '../contracts';

export default class ContractsStore {
  @observable contracts = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.setContracts = this.setContracts.bind(this);
  }

  @action
  // TODO: generate named functions for contract methods
  setContracts() {
    const { web3, web3Status } = this.rootStore.web3Store;

    if (web3Status === 'web3-ok') {
      Object.keys(contractsConfig).forEach((name) => {
        this.contracts.set(name, {
          ...contractsConfig[name],
          instance: web3.eth.contract(contractsConfig[name].abi).at(contractsConfig[name].address),
          call: function(method, args = []) {
            // console.log(`Call: ${name}.${method}(${args.join(', ')})`);
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
                  this.rootStore.transactionsStore.setTransaction(txHash);
                  resolve(txHash);
                }
              });
            });
          },
        });
      });

    } else {
      log('Bad web3 status, contracts not initialized.');
    }
  }

}
