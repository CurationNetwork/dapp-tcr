import { action, observable } from 'mobx';
import axios from 'axios';

export default class TcrStore {
  @observable list = [];
  @observable listIds = [];

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.fetchRegistry = this.fetchRegistry.bind(this);
  }

  @action
  fetchRegistry() {
    const { web3, contracts } = this.rootStore.web3Store;
    let tempList;

    if (web3 && contracts && contracts['Registry']) {      
      contracts['Registry'].call('list')
      .then(ids => {
        this.listIds = ids;
        return Promise.all(ids.map(id => {
          return contracts['Registry'].call('get_info', [id])
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

        // this.fetch_challenge_statuses()
      });
    } else {
      setTimeout(this.fetchRegistry, 200);
    }
  }
}