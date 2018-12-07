import { action, observable } from 'mobx';

import { isTx } from '../helpers/eth-tools';

export default class TransactionsStore {
  @observable transactions = new Map();

  TX_STATUS = Object.freeze({
    PENDING: 0,
    FAILURE: 1,
    SUCCESS: 2
  });

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
    const { TX_STATUS } = this;

    if (!isWeb3Available()) {
      return;
    }

    web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
      if (receipt) {
        this.transactions.set(txHash, {
          status: receipt.status === '0x0' ? TX_STATUS.FAILURE : TX_STATUS.SUCCESS,
          receipt,
        })

      } else if (!err) {
        this.transactions.set(txHash, {
          status: TX_STATUS.PENDING
        });
        this.rootStore.subscriptionsStore
          .subscribe('transactionsStore', 'getTxReceipt', [txHash]);

      } else {
        this.transactions.set(txHash, {
          status: TX_STATUS.FAILURE,
          error: err
        });
        console.error(err);
      }
    });
  };
  


}
