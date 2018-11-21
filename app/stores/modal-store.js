import { action, observable } from 'mobx';

export default class ModalStore {
  @observable modalClose = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.setModalClose = this.setModalClose.bind(this);
  }

  @action
  setModalClose(close) {
    this.modalClose = close;
  };
  
}
