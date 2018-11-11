import { action, observable, runInAction } from 'mobx';

export default class SubscriptionsStore {
  // @observable blockSubscription;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.blockInterval = undefined;
    this.currentBlock = undefined;
    this.subscriptions = [];

    this.initSubscription = this.initSubscription.bind(this);
    this.onNewBlock = this.onNewBlock.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  @action
  initSubscription() {
    const { web3, web3Status } = this.rootStore.web3Store;

    if (web3Status === 'web3-ok') {
      this.blockInterval = setInterval(() => {
        web3.eth.getBlockNumber((err, res) => {
          if (err) console.error(err);
          else {
            if (res !== this.currentBlock) {
              this.currentBlock = res;
              this.onNewBlock();
            }
          }
        });
      }, 3000);
    }
  }

  @action
  onNewBlock() {
    console.log('Last block: ' + this.currentBlock);
    this.subscriptions.forEach(s => s());
  }

  // TODO: unsubscribe function
  @action
  subscribe(storeName, funcName, ...args) {
    this.subscriptions.push(() => {
      this.rootStore[storeName][funcName](...args);
    });
  }


}
