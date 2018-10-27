'use strict';

const Token = artifacts.require("./Token.sol");
const Voting = artifacts.require("./Voting.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("RegistryTestHelper.sol");
const l = console.log;

contract('Registry', function(accounts) {

    let token, voting, params, registry;
    let listing_id;

    async function instantiate() {
      const token = await Token.new();
      const voting = await Voting.new();
      const params = await Parameterizer.new([web3.toWei(1, 'ether'), 60, 60, 60, 50, 51, 60, 60]);
      const registry = await Registry.new(token.address, voting.address, params.address);

      await registry.setTime(1000000000);

      await voting.set_registry(registry.address);

      const my_tokens = await token.balanceOf(accounts[0]);
      await token.approve(registry.address, my_tokens);

      return [token, voting, params, registry];
    }

    it("test instantiate", async function() {
        [token, voting, params, registry] = await instantiate();
    });

    it("test apply", async function() {
        await registry.apply(web3.toHex('foobar'));

        const list = await registry.list();
        assert.equal(list.length, 1);
        listing_id = list[0];

        const info = await registry.get_info(listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test application can be accepted", async function() {
        await registry.setTime(1000000100);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], true);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test application accepted", async function() {
        await registry.update_status(listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash*/
    });

    it("test another application", async function() {
        await registry.apply(web3.toHex('zzz'));

        const list = await registry.list();
        assert.equal(list.length, 2);
        assert.equal(list[0], listing_id);

        const info = await registry.get_info(list[1]);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('zzz'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });
});
