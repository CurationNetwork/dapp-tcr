import { action, observable } from 'mobx';

import { isTx } from '../helpers/eth-tools';

export default class TransactionsStore {
  @observable transactions = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.setTransaction = this.setTransaction.bind(this);
    this.getTxReceipt = this.getTxReceipt.bind(this);
  }

  @action
  setTransaction(txHash) {
    if (isTx(txHash)) {
      this.transactions.set(txHash, {
        status: 'pending'
      });
      this.getTxReceipt(txHash);
    }
  }

  @action
  getTxReceipt(txHash) {
    const { web3, isWeb3Available } = this.rootStore.web3Store;

    if (!isWeb3Available()) {
      return;
    }

    web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
      if (receipt) {
        this.transactions.set(txHash, {
          status: receipt.status === '0x0' ? 'failure' : 'success',
          receipt,
        })
      } else if (!err) {
        setTimeout(() => this.getTxReceipt(txHash), 500);
      } else {
        console.error(err);
      }
    });
  };
  


}
