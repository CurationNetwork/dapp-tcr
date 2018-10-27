'use strict';

const Token = artifacts.require("./Token.sol");
const Faucet = artifacts.require("./Faucet.sol");
const Voting = artifacts.require("./Voting.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("Registry.sol");


const initialTokenHolders = ['0x6290C445A720E8E77dd8527694030028D1762073'];
const initialTokens = 1000;
const totalSupply = 1000000;


module.exports = function(deployer, network) {
  let token;
  let voting;
  let params;
  let faucet;

  deployer.deploy(Token).then(function (ret) {
    token = ret;
    return deployer.deploy(Voting);
  }).then(function (ret) {
    voting = ret;
    return deployer.deploy(Faucet, [web3.toWei(100)]);
  }).then(function (ret) {
    faucet = ret;
    return deployer.deploy(Parameterizer, [web3.toWei(100, 'ether'), 60, 60, 60, 50, 50, 60, 60]);
  }).then(function(ret){
    params = ret;
    return deployer.deploy(Registry, token.address, voting.address, params.address);
  }).then(function(registry){
    return voting.set_registry(registry.address);
  }).then(function() {
      return token.transfer(faucet.address, web3.toWei(totalSupply - initialTokens * initialTokenHolders.length));
  }).then(function () {
      return Promise.all(
          initialTokenHolders.map(addr => {
            token.transfer(addr, web3.toWei(initialTokens))
          })
      );
  });
};
