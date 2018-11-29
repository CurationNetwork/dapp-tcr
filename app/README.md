### @class Web3Store
MobX store for web3 state management.

##### MobX @observables
- web3 - web3 instance is accessible from any part of code
- web3Status - current web3 state (enum of values stored in WEB3_STATUS constant object)
- networkId - currently active in user's wallet network ID
- defaultAccount - currently active in user's wallet address

##### @constructor(rootStore)
To be able to interact with a blockchain we should initialize __web3__ instance and set it's __provider__ (which is a wallet connected to a node actually). Check for available web3 provider is called on window load event listened from the constructor of our __web3-store class__. Web3 provider availability is so important that we check it constantly by interval timer to be able instantly react in case of changes in user wallet state.

```javascript
window.addEventListener('load', () => {
  this.checkWeb3Status();
  this.web3CheckInterval = setInterval(() => {
    this.checkWeb3Status();
  }, this.WEB3_CHECK_INTERVAL;
});
```

##### @method checkWeb3Status()
Function called by interval to check current web3 environment state. Every time __web3 provider__ is found, unlocked and authorized (which means it's available to our code), we check current network and active (aka default) address. So if user changes it in his wallet, we will be able to react instantly. First time we catch web3, our web3-dependent modules are initialized.
```javascript
if (status === WEB3_STATUS.OK) {
  ...
  if (!this.isDependentsSet) {
    this.setDependents();
  }
}
```

##### @method setWeb3()
Initializes web3 instance if web3 provider is available in current environment.

##### @method setNetwork()
Gets currently active network ID.

##### @method setDefaultAccount()
Gets currently active account (user address).

##### @method initDepencies()
__Smart contracts__ abstraction layer is the main part of code, dependent on __web3__. It's initialized as soon as web3 is available. As well, here we initialize subscriptions handling every new blockchain block. This is useful when events are not implemented in contracts or they are not enough. All custom web3 dependent code should be initialized here

```javascript
// contracts ABI load
this.rootStore.contractsStore.setContracts();

// subscriptions
this.rootStore.subscriptionsStore.initSubscriptions();
```

##### @method isWeb3Available()
This boolean method is widely used by dependencies to check is web3 (still) available

> TODO: Unset current network and address on losing web3, notify dependents.
> TODO: Reinitialize dependents after web3 lost and found again.

### @class ContractsStore
##### MobX @observables
- contracts - map of initialized contract objects. Every object includes: address, ABI, web3 contract instance (web3.eth.contract(...).at(...)), generic __call__ and __send__ functions to access contract functions, both returning Promise.

##### @constructor(rootStore)
For now only function bindings here.

##### @method setContracts()
Initializes contracts.

> TODO: Store contracts network ID, compare it with active network.
> TODO: reinit contracts in case of switching networks (select only contracts from active network)
