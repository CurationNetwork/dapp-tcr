import { action, observable } from 'mobx';
import axios from 'axios';

export default class TcrStore {
  @observable registry = [];
  @observable registryIds = [];

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.fetchRegistry = this.fetchRegistry.bind(this);
    this.fetchChallengeStatuses = this.fetchChallengeStatuses.bind(this);
    this.apply = this.apply.bind(this);
    this.challenge = this.challenge.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.isReady = this.isReady.bind(this);
  }

  @action
  fetchRegistry() {
    const { contracts } = this.rootStore.contractsStore;
    let tempList;

    if (this.isReady('fetchRegistry')) {      
      contracts.get('Registry').call('list') // get items list
      .then(ids => { // get items details
        this.registryIds = ids;
        return Promise.all(ids.map(id => {
          return contracts.get('Registry').call('get_info', [id]);
        }));
      })
      .then(res => { // get more details from IPFS
        tempList = res;        
        return Promise.all(tempList.map(item => {
          return axios.get('https://ipfs.io' + '/ipfs/' + Buffer.from(item[3].substr(2), 'hex').toString())
        }))
      })
      .then(res => { // process data into convenient format
        res.forEach((data, idx) => {
          tempList[idx].ipfs_data = data;
        });

        this.registry = tempList.map((l, i) => {
          const res = {};
          res.id = this.registryIds[i];
          res.state = ['NOT_EXISTS', 'APPLICATION', 'EXISTS', 'EDIT', 'DELETING'][+l[0].toString()];
          res.isChallenged = l[1];
          res.canBeUpdated = l[2];
          res.ipfsHash = l[3];
          res.proposedIpfsHash = l[4];
          res.ipfsData = l.ipfs_data.data;
          return res;
        });
        
        this.fetchChallengeStatuses();
      })
    } else {
      setTimeout(this.fetchRegistry, 200);
    }
  }

  @action
  fetchChallengeStatuses() {
    const { contracts } = this.rootStore.contractsStore;

    if (!this.isReady('fetchChallengeStatuses')) return null;

    Promise.all(this.registry.map(item => {
      if (item.isChallenged)
        return contracts.get('Registry').call('challenge_status', [item.id]);
      else
        return null;
    })).then(res => {
      res.forEach((data, i) => {
        if (data !== null) {
          this.registry[i].challengeStatus = {
            phase: data[1] === 0 ? 'commit' : 'reveal',
            challengeId: data[0],
            votesFor: data[3],
            votesAgainst: data[4],
            commitEndDate: data[5],
            revealEndDate: data[6]
          }
        }
        else {
          this.registry[i].challengeStatus = null;
        }
      });
    });
  }

  @action
  apply(bytesHash, cb) {
    const { contracts } = this.rootStore.contractsStore;

    if (!this.isReady('apply')) return null;

    contracts.get('Registry').send('apply', [bytesHash])
      .then(res => {
        if (cb) cb(res);
      }) 
      .catch(err => {
        console.error(err);
        if (cb) cb(err);
      });
  }

  @action
  challenge(id, state) {
    const { contracts } = this.rootStore.contractsStore;

    if (!this.isReady('challenge')) return null;

    contracts.get('Registry')
      .send('challenge', [id, state])
      .then();
  }

  @action
  updateStatus(id) {
    const { contracts } = this.rootStore.contractsStore;

    if (!this.isReady('updateStatus')) return null;

    contracts.get('Registry')
      .send('update_status', [id])
      .then();
  }

  isReady(fName = undefined) {
    const { web3 } = this.rootStore.web3Store;
    const { contracts } = this.rootStore.contractsStore;

    const isR = web3 && contracts && contracts.has('Registry');
    if (!isR && fName) {
      console.log(`tcrStore.${fName} failed`);
    }
    return isR;
  }


}
