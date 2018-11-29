import { action } from 'mobx';

export default class SubscriptionsStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.blockInterval = undefined;
    this.currentBlock = undefined;
    this.subscriptions = [];

    this.initSubscriptions = this.initSubscriptions.bind(this);
    this.onNewBlock = this.onNewBlock.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  @action
  initSubscriptions() {
    if (this.blockInterval) {
      return;
    }

    const { isWeb3Available } = this.rootStore.web3Store;
    if (!isWeb3Available()) {
      console.error('Block subscription init failed');
      return;
    }

    this.blockInterval = setInterval(() => {
      web3.eth.getBlockNumber((err, res) => {
        if (err) console.error(err);
        else if (res !== this.currentBlock) {
          this.currentBlock = res;
          this.onNewBlock();
        }
      });
    }, 3000);
  }

  @action
  onNewBlock() {
    console.log('Last block: ' + this.currentBlock);
    this.subscriptions.forEach(s => s());
  }

  // TODO: unsubscribe function
  @action
  subscribe(storeName, funcName, args = []) {
    this.subscriptions.push(() => {
      this.rootStore[storeName][funcName](...args);
    });
  }

}
