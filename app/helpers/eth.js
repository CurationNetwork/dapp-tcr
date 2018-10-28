import React from 'react';
import { decodeEvent } from 'ethjs-abi'
export let web3 = null;

window.addEventListener('load', () => getWeb3Instance());
export const getWeb3Instance = () => {
    if (window.ethereum) {
        // Request account access if needed
        window.ethereum.enable()
            .then(() => {
                web3 = new window.Web3(window.ethereum);
                init();
            })
            .catch((error) => web3 = 'not-available');
    }
    else if (window.web3) {
        web3 = new window.Web3(window.web3.currentProvider);
        init();
    } else {
        web3 = null;
    }
};

import * as Token from './contracts/Token.json';
import * as Voting from './contracts/Voting.json';
import * as Faucet from './contracts/Faucet.json';
import * as Registry from './contracts/Registry.json';

const contractAddr = {
    Token: '0xb6c77b0365a3f5830579dea88126d3a77f4e8587',
    Voting: '0xfede8c5ec0584abfe2448d178ceb782e8c9d2f7d',
    Faucet: '0xdf44291b8a644babbf80ea30f4f833b665827192',
    Registry: '0xa9a3bbb03b35c1a32dcf2606e9ecd7396c902d65'
};

const contractAbi = {
    Token: Token.abi,
    Voting: Voting.abi,
    Faucet: Faucet.abi,
    Registry: Registry.abi
};

let contracts = [];

const addContract = (name, address, abi) => {
  let inst = web3.eth.contract(abi).at(address);//new web3.eth.Contract(abi, address);
  contracts[name] = {
      instance: inst,
      call: (method, args = []) => {
          let err = checkMetaMask();
          if (err) {
              alert(err);
              return Promise.reject(err);
          }
          else {
              return new Promise((resolve, reject) => {
                  inst[method](...args, (err, res) => {
                      if (err)
                          reject(err);
                      else
                          resolve(res);
                  });
              });
          }
      },
      send: (method, args = [], onMined = null) => {
          return new Promise((resolve, reject) => {
              let err = checkMetaMask();
              if (err) {
                  alert(err);
                  return reject(err);
              }
              else {
                  inst[method](...args, (err, txHash) => {
                      if (err) {
                          reject(err);
                      }
                      if (onMined) {
                          getTxReceipt(txHash, onMined);
                      }
                      resolve(txHash);
                  });
              }
          });
      }
  };

  console.log(contracts);
};


export const Contract = (name) => {
    return contracts[name];
};


const init = () => {
    console.log(web3);

    Object.keys(contractAddr).forEach(key => {
        addContract(key, contractAddr[key], contractAbi[key]);
    });
};

export const getNetworkId = cb => {
  web3.version.getNetwork((err, netId) => {
    err && console.error(err);
    netId && cb(netId);
  });
};

export const getNetworkName = netId => {
  switch (netId.toString()) {
    case "1":
      return "Mainnet";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    case "42":
      return "Kovan";
    default:
      return "Error! Unknown or deprecated network";
  }
};

export const getNetworkEtherscanAddress = netId => {
  switch (netId.toString()) {
    case "1":
      return "https://etherscan.io";
    case "3":
      return "https://ropsten.etherscan.io";
    case "4":
      return "https://rinkeby.etherscan.io";
    case "42":
      return "https://kovan.etherscan.io";
    default:
      return "Error! Unknown or deprecated network";
  }
};

export const checkMetaMask = () => {
  if (!window.Web3) {
    return 'noMetamask';
  }

  if (!window.web3.eth.defaultAccount) {
    return 'unlockMetamask';
  }

  return null;
};

export const getTxReceipt = (txHash, cb) => {
  web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
    if (null == receipt)
      window.setTimeout(() => getTxReceipt(txHash, cb), 500);
    else {
      cb(receipt);
    }
  });
};

export const isAddress = (hash) => {
  if (typeof hash === 'string') {
    return /^0x([A-Fa-f0-9]{40})$/.test(hash);
  } else {
    return false;
  }
};

export const isTx = (hash) => {
  if (typeof hash === 'string') {
    return /^0x([A-Fa-f0-9]{64})$/.test(hash);
  } else {
    return false;
  }
};


export const makeEtherscanLink = (hash, netId, showNetworkName = false) => {
  if (!hash || !netId) return hash;

  const explorerAddress = getNetworkEtherscanAddress(netId);
  const networkName = getNetworkName(netId);
  if (isAddress(hash)) {
    return (
      <span>
        <a href={`${explorerAddress}/address/${hash}`} target="_blank">
          {hash}
        </a>{showNetworkName && ` (${networkName})`}
      </span>
    );
  } else {
    return hash;
  }
};

export const makeTxEtherscanLink = (hash, netId, showNetworkName = false) => {
  if (!hash || !netId) return hash;

  const explorerAddress = getNetworkEtherscanAddress(netId);
  const networkName = getNetworkName(netId);
  if (isTx(hash)) {
    return (
      <span>
        <a href={`${explorerAddress}/tx/${hash}`} target="_blank">
          {hash}
        </a>{showNetworkName && ` (${networkName})`}
      </span>
    );
  } else {
    return hash;
  }
};

/**
 * Return decoded event
 *
 * @param contractInstance
 * @param log
 */
export const decodeEventOfInstance = (contractInstance, log) => {
  const abi = contractInstance.abi;
  let eventAbi = null;


  for (let i = 0; i < abi.length; i++) {
    let item = abi[i];
    if (item.type !== "event") continue;
    let signature = item.name + "(" + item.inputs.map(function (input) {
      return input.type;
    }).join(",") + ")";
    let hash = web3.sha3(signature);
    if (hash === log.topics[0]) {
      eventAbi = item;
      break;
    }
  }

  if (!eventAbi) {
    return false;
  }

  let decodedEvent;

  try {
    decodedEvent = decodeEvent(eventAbi, log.data, log.topics, false);
  } catch (e) {
    return false;
  }
  let event = {
    params: {},
    name: decodedEvent._eventName
  };
  for (let prop in decodedEvent) {
    if (!decodedEvent.hasOwnProperty(prop)) {
      continue;
    }

    if (prop !== '_eventName') {
      event.params[prop] = decodedEvent[prop]
    }
  }

  return event;
};