export const getTxReceipt = (txHash, cb) => {
  web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
    if (null == receipt)
      window.setTimeout(() => getTxReceipt(txHash, cb), 500);
    else {
      cb(receipt);
    }
  });
};

export const getNetworkName = netId => {
  const n = Number(netId);

  if (!n || Number.isNaN(n))
    return undefined;
  
  const m = new Map([
    [1, 'Ethereum'],
    [2, 'Morden'],
    [3, 'Ropsten'],
    [4, 'Rinkeby'],
    [8, 'Ubiq'],
    [42, 'Kovan'],
    [77, 'POA Sokol'],
    [99, 'POA Core'],
    [100, 'xDai'],
    [401697, 'Tobalaba'],
    [7762959, 'Musicoin'],
    [61717561, 'Aquachain']
  ]);

  if (m.has(n)) return m.get(n);
  else return 'Unknown network';
};

export const getNetworkExplorerAddress = netId => {
  const n = Number(netId);

  const m = new Map([
    [1, 'https://etherscan.io'],
    [3, 'https://ropsten.etherscan.io'],
    [4, 'https://rinkeby.etherscan.io'],
    [8, 'https://ubiqscan.io'],
    [42, 'https://kovan.etherscan.io'],
    [77, 'https://blockscout.com/poa/sokol'],
    [99, 'https://blockscout.com/poa/core'],
    [100, 'https://blockscout.com/poa/dai'],
    [401697, 'https://tobalaba.etherscan.com'],
    [7762959, 'https://explorer.musicoin.org']
  ]);

  if (m.has(n)) return m.get(n);
  else return undefined;
};

export const detectWallet = () => {
  if (window.ethereum){
    return "modern_metamask"
  }
  if (window.web3){
    if (window.web3.currentProvider && window.web3.currentProvider.isMetaMask){
      return "metamask"
    }
    if (window.web3.currentProvider && window.web3.currentProvider.isTrust === true) {
      return "trust"
    }
    if ((!!window.__CIPHER__) && (window.web3.currentProvider && window.web3.currentProvider.constructor && window.web3.currentProvider.constructor.name === "CipherProvider")) {
      return "cipher"
    }
    if (window.web3.isDAppBrowser && window.web3.isDAppBrowser()) {
      return "dapp"
    }
    return "unknown"
  }
  return "non_web3"
}

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
