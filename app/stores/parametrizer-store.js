import { action, observable } from 'mobx';

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
    const { contracts } = this.rootStore.contractsStore;

    if (this.isReady('fetchParameters')) {
      const paramContract = contracts.get('Parametrizer');
      
      this.paramNames.forEach(p => {        
        paramContract.call('get', [p])
          .then(value => {this.tcrParameters.set(p, value.toNumber())})
          .catch(console.error);
      })
    }
  }

  isReady(fName = undefined) {
    const { web3 } = this.rootStore.web3Store;
    const { contracts } = this.rootStore.contractsStore;

    const isR = web3 && contracts && contracts.has('Parametrizer');
    if (!isR && fName) {
      console.log(`parametrizerStore.${fName} failed`);
    }
    return isR;
  }


}
