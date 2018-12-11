import { action, observable } from 'mobx';

import { isTx } from '../helpers/eth-tools';

export default class TransactionsStore {
  @observable transactions = new Map();
  subscriptions = new Map();

  TX_STATUS = Object.freeze({
    PENDING: 0,
    FAILURE: 1,
    SUCCESS: 2
  });

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.setTransaction = this.setTransaction.bind(this);
    this.getTxReceipt = this.getTxReceipt.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  @action
  setTransaction(txHash) {
    if (isTx(txHash)) {
      this.transactions.set(txHash, {
        status: this.TX_STATUS.PENDING
      });
      this.getTxReceipt(txHash);
    }
  }

  @action
  getTxReceipt(txHash) {
    const { web3, isWeb3Available } = this.rootStore.web3Store;
    const { TX_STATUS, transactions, subscribe, unsubscribe } = this;

    if (!isWeb3Available()) {
      return;
    }

    web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
      if (receipt) { // tx mined, set success status, unsubscribe
        transactions.set(txHash, { 
          status: receipt.status === '0x0' ? TX_STATUS.FAILURE : TX_STATUS.SUCCESS,
          receipt,
        });
        unsubscribe(txHash);

      } else if (!err) { // tx not mined, set pending status, subscribe if not yet
        transactions.set(txHash, {
          status: TX_STATUS.PENDING
        });
        subscribe(txHash);

      } else { // tx error, set error status, unsubscribe
        transactions.set(txHash, {
          status: TX_STATUS.FAILURE,
          error: err
        });
        unsubscribe(txHash);
      }
    });
  };
  
  subscribe(tx) {
    const { subscribe } = this.rootStore.subscriptionsStore;
    const { subscriptions } = this;

    if (!subscriptions.has(tx)) {
      const index = subscribe('transactionsStore', 'getTxReceipt', [tx]);
      subscriptions.set(tx, index);
    }
  }

  unsubscribe(tx) {
    const { unsubscribe } = this.rootStore.subscriptionsStore;
    const { subscriptions } = this;

    if (subscriptions.has(tx)) {
      unsubscribe(subscriptions.get(tx));
      subscriptions.delete(tx);
    }
  }

}
