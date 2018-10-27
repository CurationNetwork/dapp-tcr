'use strict';

const Token = artifacts.require("./Token.sol");
const Voting = artifacts.require("./Voting.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("RegistryTestHelper.sol");
const l = console.log;

contract('Registry', function(accounts) {

    async function instantiate() {
      const token = await Token.new();
      const voting = await Voting.new();
      const params = await Parameterizer.new([web3.toWei(1, 'ether'), 60, 60, 60, 50, 51, 60, 60]);
      const registry = await Registry.new(token.address, voting.address, params.address);

      await voting.set_registry(registry.address);

      const my_tokens = await token.balanceOf(accounts[0]);
      await token.approve(registry.address, my_tokens);

      return [token, voting, params, registry];
    }

    it("test instantiate", async function() {
        const [token, voting, params, registry] = await instantiate();
    });

    it("test apply", async function() {
        const [token, voting, params, registry] = await instantiate();

        await registry.apply(web3.toHex('foobar'));

        l(await registry.list());
    });
});
