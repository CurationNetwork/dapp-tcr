export const getNetworkId = cb => {
  web3.version.getNetwork((err, netId) => {
    err && console.error(err);
    netId && cb(netId);
  });
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
