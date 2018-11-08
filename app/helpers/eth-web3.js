window.addEventListener('load', () => getWeb3Instance());

export let web3 = null;

let onInit;
export const web3Init = new Promise((resolve, reject) => {
  onInit = resolve;
});

function getWeb3Instance() {
  if (!web3) {
    if (window.ethereum) {
      window.ethereum.enable()
        .then(() => {
          web3 = new window.Web3(window.ethereum);
          onInit(web3);
        })
        .catch(() => web3 = 'not-available');      
    } else if (window.web3) {
      web3 = new window.Web3(window.web3.currentProvider);
      onInit(web3);
    }
  }
}

export const checkWeb3Status = () => {
  if (!window.Web3) return 'No web3 wallet found';
  if (!window.web3.eth.defaultAccount) return 'Web3 wallet is locked';
  return null;
};
