import { action, observable, runInAction } from 'mobx';

export default class TokenStore {
  @observable tokenName;
  @observable symbol;
  @observable decimals;

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.fetchTokenInfo = this.fetchTokenInfo.bind(this);
  }

  @action
  fetchTokenInfo() {
  const { isContractReady } = this.rootStore.contractsStore;

    if (!isContractReady('Token', 'fetchTokenInfo') || this.name) {
      return;
    }

    const { contracts } = this.rootStore.contractsStore;
    const tokenContract = contracts.get('Token');

    ['tokenName', 'symbol', 'decimals'].forEach(p => {        
      tokenContract.call(p)
        .then(v => {
          runInAction(() => {this[p] = p === 'decimals' ? v.toNumber() : v});
        })
        .catch(console.error);
    });
  }

  weiToTokens(wei) {
    return wei / Math.pow(10, this.decimals);
  }

}
