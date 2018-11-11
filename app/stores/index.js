import { RouterStore } from 'mobx-react-router';

import TcrStore from './tcr-store';
import Web3Store from './web3-store';
import ContractsStore from './contracts-store';
import SubscriptionsStore from './subscriptions-store';

export class Stores {
  constructor() {
    this.router = new RouterStore();
    this.web3Store = new Web3Store(this);
    this.contractsStore = new ContractsStore(this);
    this.tcrStore = new TcrStore(this);
    this.subscriptionsStore = new SubscriptionsStore(this);
  }
}

export default new Stores();
