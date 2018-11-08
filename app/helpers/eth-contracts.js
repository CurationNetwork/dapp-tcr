let onInit;
export const afterInit = new Promise((resolve, reject) => {
  onInit = resolve;
});

export function initContracts(web3, contracts) {
  return new Promise((res, rej) => {
    if (web3 && contracts) {
      Object.keys(contracts).forEach((name) => {
        contracts[name] = {
          ...contracts[name],
          instance: web3.eth.contract(contracts[name].abi).at(contracts[name].address),
          call: function(method, args = []) {
            return new Promise((resolve, reject) => {
              this.instance[method](...args, (err, res) => {
                err ? reject(err) : resolve(res);
              });
            });
          },
          send: function(method, args = [], onMined = null) {
            return new Promise((resolve, reject) => {
              this.instance[method](...args, (err, txHash) => {
                // if (onMined) getTxReceipt(txHash, onMined);
                err ? reject(err) : resolve(txHash);
              });
            });
          },
        };
      });
      res(contracts);

    } else {
      rej('Error in initContracts');
    }
  });
}
