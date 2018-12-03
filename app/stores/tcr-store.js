import { action, observable } from 'mobx';
import axios from 'axios';

export default class TcrStore {
  @observable registry = [];
  @observable registryIds = [];
  newRegistry = [];

  TCR_ITEM_STATUS = Object.freeze({
    NOT_EXISTS: 'NOT_EXISTS',
    APPLICATION: 'APPLICATION',
    EXISTS: 'EXISTS',
    EDIT: 'EDIT',
    DELETING: 'DELETING'
  });

  constructor(rootStore) {
    this.rootStore = rootStore;

    this.fetchRegistry = this.fetchRegistry.bind(this);
    this.fetchChallengeStatuses = this.fetchChallengeStatuses.bind(this);
    this.fetchApplicationEndDates = this.fetchApplicationEndDates.bind(this);
    this.apply = this.apply.bind(this);
    this.challenge = this.challenge.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.isReady = this.isReady.bind(this);
  }

  initRegistry() {
    if (this.registry.length) { // init once
      return;
    }

    if (!this.isReady('fetchRegistry')) {
      setTimeout(this.initRegistry, 200);
      return;
    }
    
    this.fetchRegistry();  
    this.rootStore.subscriptionsStore.subscribe('tcrStore', 'fetchRegistry');
  }

  @action
  fetchRegistry() {
    if (!this.isReady('fetchRegistry')) {
      return;
    }
    
    const { contracts } = this.rootStore.contractsStore;
    let tempList;

    contracts.get('Registry').call('list') // get items list
    .then(ids => { // get items details
      this.registryIds = ids;
      console.log(ids);
      
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

      const { NOT_EXISTS, APPLICATION, EXISTS, EDIT, DELETING } = this.TCR_ITEM_STATUS;
      this.newRegistry = tempList.map((l, i) => {
        const res = {};
        res.id = this.registryIds[i];
        res.state = [NOT_EXISTS, APPLICATION, EXISTS, EDIT, DELETING][+l[0].toString()];
        res.isChallenged = l[1];
        res.canBeUpdated = l[2];
        res.ipfsHash = l[3];
        res.proposedIpfsHash = l[4];
        res.ipfsData = l.ipfs_data.data;
        return res;
      });        

      if (!this.registry.length) this.registry = this.newRegistry; // first time render instantly
      
      Promise.all([ // to prevent blinking render new registry only after all fetches
        this.fetchChallengeStatuses(),
        this.fetchApplicationEndDates()
      ])
      .then(() => {
        this.registry = this.newRegistry;
      })
      .catch(console.error);
    })
  }

  @action
  fetchChallengeStatuses() {
    return new Promise((resolve, reject) => {
      if (!this.isReady('fetchChallengeStatuses')) {
        reject(new Error('No web3 or contract object'));
      }

      const { contracts } = this.rootStore.contractsStore;
      Promise.all(this.newRegistry.map(item => {
        if (item.isChallenged)
          return contracts.get('Registry').call('challenge_status', [item.id]);
        else
          return null;
      }))
      .then(res => {
        res.forEach((data, i) => {
          if (data !== null) {
            this.newRegistry[i].challengeStatus = {
              phase: data[1] === 0 ? 'commit' : 'reveal',
              challengeId: data[0],
              votesFor: data[3],
              votesAgainst: data[4],
              commitEndDate: data[5],
              revealEndDate: data[6]
            }
          }
          else {
            this.newRegistry[i].challengeStatus = null;
          }
        });
        resolve();
      });
    });
  }

  @action
  fetchApplicationEndDates() {
    return new Promise((resolve, reject) => {
      if (!this.isReady('fetchApplicationEndDates')) {
        reject(new Error('No web3 or contract object'));
      }

      const { contracts } = this.rootStore.contractsStore;

      const applicationIds = this.newRegistry.reduce((apps, item) => {
        if (item.state === 'APPLICATION') apps.push(item.id);
        return apps;
      }, []);

      const eventFilter1 = {
        listingHash: applicationIds
      };
      const eventFilter2 = {
        fromBlock: 0,
        toBlock: 'latest'
      };
      const event = contracts.get('Registry').instance._Application(eventFilter1, eventFilter2);

      event.get((err, res) => {
        if (err) reject(err);
        else {
          res = Array.isArray(res) ? res : [res];
          res.forEach(e => {
            const { listingHash, appEndDate } = e.args;
            this.newRegistry.find(ee => ee.id === listingHash)
              .appEndDate = appEndDate.toNumber();
          });
          resolve();
        }
      });
    });
  }

  @action
  apply(bytesHash, cb) {
    const { contracts } = this.rootStore.contractsStore;

    if (!this.isReady('apply')) return;

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

    if (!this.isReady('challenge')) return;

    contracts.get('Registry')
      .send('challenge', [id, state])
      .then();
  }

  @action
  updateStatus(id) {
    const { contracts } = this.rootStore.contractsStore;

    if (!this.isReady('updateStatus')) return;

    contracts.get('Registry')
      .send('update_status', [id])
      .then();
  }

  isReady(fName = undefined) {
    const { isWeb3Available } = this.rootStore.web3Store;
    const { contracts } = this.rootStore.contractsStore;

    const isR = isWeb3Available() && contracts && contracts.has('Registry');
    if (!isR && fName) {
      console.log(`tcrStore.${fName} failed`);
    }

    return isR;
  }


}
