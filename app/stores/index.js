import { RouterStore } from 'mobx-react-router';

import TcrStore from './tcr-store';
import Web3Store from './web3-store';

export class Stores {
  constructor() {
    this.router = new RouterStore();
    this.tcrStore = new TcrStore(this);
    this.web3Store = new Web3Store(this);
  }
}

export default new Stores();
