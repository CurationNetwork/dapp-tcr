import { action, observable } from 'mobx';
import axios from 'axios';

export default class TcrStore {
  @observable list = [];
  @observable listIds = [];

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.fetchRegistry = this.fetchRegistry.bind(this);
    this.fetchChallengeStatuses = this.fetchChallengeStatuses.bind(this);
  }

  @action
  fetchRegistry() {
    const { web3 } = this.rootStore.web3Store;
    const { contracts } = this.rootStore.contractsStore;
    let tempList;

    console.log("!");
    

    if (web3 && contracts && contracts.has('Registry')) {      
      contracts.get('Registry').call('list')
      .then(ids => {
        this.listIds = ids;
        return Promise.all(ids.map(id => {
          return contracts.get('Registry').call('get_info', [id])
        }))
      })
      .then(res => {
        tempList = res;
        return Promise.all(tempList.map(item => {
          return axios.get('https://ipfs.io' + '/ipfs/' + Buffer.from(item[3].substr(2), 'hex').toString())
        }))
      })
      .then(res => {
        res.forEach((data, idx) => {
          tempList[idx].ipfs_data = data;
        });

        this.list = tempList.map((l, i) => {
          const res = {};
          res.id = this.listIds[i];
          res.state = ['NOT_EXISTS', 'APPLICATION', 'EXISTS', 'EDIT', 'DELETING'][+l[0].toString()];
          res.isChallenged = l[1];
          res.canBeUpdated = l[2];
          res.ipfsHash = l[3];
          res.proposedIpfsHash = l[4];
          res.ipfsData = l.ipfs_data.data;
          return res;
        });

        this.fetchChallengeStatuses();
      });
    } else {
      setTimeout(this.fetchRegistry, 200);
    }
  }

  @action
  fetchChallengeStatuses() {
    const { web3, contracts } = this.rootStore.web3Store;

    if (!web3 || !contracts || !contracts.has('Registry')) return null;

    Promise.all(this.list.map(item => {
      if (item.isChallenged)
        return contracts.get('Registry').call('challenge_status', [item.id]);
      else
        return null;
    })).then(res => {
      res.forEach((data, i) => {
        if (data !== null) {
          this.list[i].challengeStatus = {
            phase: data[1] === 0 ? 'commit' : 'reveal',
            challengeId: data[0],
            votesFor: data[3],
            votesAgainst: data[4],
            commitEndDate: data[5],
            revealEndDate: data[6]
          }
        }
        else {
          this.list[i].challengeStatus = null;
        }
      });
    });
  }

  @action
  apply(bytesHash) {
    const { web3, contracts } = this.rootStore.web3Store;

    if (!web3 || !contracts || !contracts.has('Registry')) return null;

    contracts.get('Registry').send('apply', [bytesHash])
      .then(res => {
        console.log(`tx hash: ${res}`);
      })
      .catch(console.error);
  }

  @action
  challenge(id, state) {
    const { web3, contracts } = this.rootStore.web3Store;

    if (!web3 || !contracts || !contracts.has('Registry')) return null;

    contracts.get('Registry')
      .send('challenge', [id, state])
      .then();
  }

  @action
  updateStatus(id) {
    const { web3, contracts } = this.rootStore.web3Store;

    if (!web3 || !contracts || !contracts.has('Registry')``) return null;

    contracts.get('Registry')
      .send('update_status', [id])
      .then();
  }


}
