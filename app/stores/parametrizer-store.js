import { action, observable, runInAction } from 'mobx';

export default class ParametrizerStore {
  @observable tcrParameters = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.paramNames = [
      "minDeposit",       // minimum deposit for listing to be whitelisted
      "applyStageLen",    // period over which applicants wait to be whitelisted
      "commitStageLen",   // length of commit period for voting
      "revealStageLen",   // length of reveal period for voting
      "dispensationPct",  // percentage of losing party's deposit distributed to winning party
      "voteQuorum",       // type of majority out of 100 necessary for candidate success
      "exitTimeDelay",    // minimum length of time user has to wait to exit the registry 
      "exitPeriodLen",    // maximum length of time user can wait to exit the registry
    ];

    this.fetchParameters = this.fetchParameters.bind(this);
  }

  @action
  fetchParameters() {
    const { isContractReady } = this.rootStore.contractsStore;

    if (
      !isContractReady('Parametrizer', 'fetchParameters')
      || this.tcrParameters.size
    ) {
      return;
    }

    const { contracts } = this.rootStore.contractsStore;
    const paramContract = contracts.get('Parametrizer');
    
    Promise.all(this.paramNames.map(p => {        
      return new Promise((res, rej) => {
        paramContract.call('get', [p])
        .then(value => {
          value = value.toNumber();
          runInAction(() => this.tcrParameters.set(p, value));
          res(value);
        })
        .catch(console.error);
      });
    }))
      .then(() => console.log('Fetched: TCR parameters'))
      .catch(console.error);
  }

}
