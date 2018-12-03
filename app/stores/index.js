import { RouterStore } from 'mobx-react-router';

import TcrStore from './tcr-store';
import Web3Store from './web3-store';
import ContractsStore from './contracts-store';
import SubscriptionsStore from './subscriptions-store';
import TransactionsStore from './transactions-store';
import FormsStore from './forms-store';
import ModalStore from './modal-store';
import ParametrizerStore from './parametrizer-store';
import TokenStore from './token-store';

export class Stores {
  constructor() {
    this.router = new RouterStore();
    this.web3Store = new Web3Store(this);
    this.contractsStore = new ContractsStore(this);
    this.tcrStore = new TcrStore(this);
    this.subscriptionsStore = new SubscriptionsStore(this);
    this.transactionsStore = new TransactionsStore(this);
    this.formsStore = new FormsStore(this);
    this.modalStore = new ModalStore(this);
    this.parametrizerStore = new ParametrizerStore(this);
    this.tokenStore = new TokenStore(this);
  }
}

export default new Stores();
