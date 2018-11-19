import { action, observable } from 'mobx';

export default class FormsStore {
  @observable formsData = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.setFormData = this.setFormData.bind(this);
  }

  @action
  setFormData(formName, formData) {
    this.formsData.set(formName, formData);
  };
  
}
