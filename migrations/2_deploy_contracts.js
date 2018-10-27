'use strict';

const Token = artifacts.require("./Token.sol");
const Voting = artifacts.require("./Voting.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("Registry.sol");


module.exports = function(deployer, network) {
  let token;
  let voting;
  let params;

  deployer.deploy(Token).then(function (ret) {
    token = ret;
    return deployer.deploy(Voting);
  }).then(function (ret) {
    voting = ret;
    return deployer.deploy(Parameterizer, [web3.toWei(100, 'ether'), 60, 60, 60, 50, 51, 60, 60]);
  }).then(function(ret){
    params = ret;
    return deployer.deploy(Registry, token.address, voting.address, params.address);
  }).then(function(registry){
    return voting.set_registry(registry.address);
  });
};
