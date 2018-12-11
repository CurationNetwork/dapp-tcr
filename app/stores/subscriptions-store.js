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
    this.unsubscribe = this.unsubscribe.bind(this);
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
    this.subscriptions.forEach(s => {
      if (s) s();
    });
  }

  @action
  subscribe(storeName, funcName, args = []) {
    const index = this.subscriptions.push(() => {
      this.rootStore[storeName][funcName](...args);
    }) - 1;
    console.log(`Subscribed: ${storeName}.${funcName}(${args.join(', ')}), index: ${index}`)
    return index;
  }

  @action
  unsubscribe(index) {
    console.log(`Unsubscribed: ${index}`)
    return delete this.subscriptions[index];
  }

}
