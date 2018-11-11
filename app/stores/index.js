import { RouterStore } from 'mobx-react-router';

import TcrStore from './tcr-store';
import Web3Store from './web3-store';
import contractsStore from './contracts-store';

export class Stores {
  constructor() {
    this.router = new RouterStore();
    this.web3Store = new Web3Store(this);
    this.contractsStore = new contractsStore(this);
    this.tcrStore = new TcrStore(this);
  }
}

export default new Stores();
