'use strict';

const Token = artifacts.require("./Token.sol");
const Voting = artifacts.require("./Voting.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("RegistryTestHelper.sol");
const l = console.log;

contract('Registry', function(accounts) {

    let token, voting, params, registry;
    let first_listing_id;
    let second_listing_id;

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

    // APPLICATION ------------------------------------------------------------

    it("test apply", async function() {
        await registry.apply(web3.toHex('foobar'));

        const list = await registry.list();
        assert.equal(list.length, 1);
        first_listing_id = list[0];

        const info = await registry.get_info(first_listing_id);
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

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], true);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test application accepted", async function() {
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash*/
    });

    it("test another application", async function() {
        await registry.apply(web3.toHex('zzz'));

        const list = await registry.list();
        second_listing_id = list[1];
        assert.equal(list.length, 2);
        assert.equal(list[0], first_listing_id);

        const info = await registry.get_info(second_listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('zzz'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash

        await registry.setTime(1000000200);
        await registry.update_status(list[1]);
        assert.equal((await registry.get_info(list[1]))[0], 2);   // EXISTS
    });

    // DELETION ---------------------------------------------------------------

    it("test calling off", async function() {
        await registry.init_exit(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 2);
        assert.equal(list[0], first_listing_id);
        assert.equal(list[1], second_listing_id);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 4);   // DELETING
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test called off", async function() {
        await registry.setTime(1000000300);
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);
        assert.equal(list[0], second_listing_id);
    });

    it("test calling off: timeout", async function() {
        await registry.setTime(1000000000);
        await registry.init_exit(second_listing_id);

        await registry.setTime(1000001000);
        await registry.update_status(second_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);
        assert.equal(list[0], second_listing_id);   // not called off!
    });

    // EDIT -------------------------------------------------------------------

    it("test edit", async function() {
        [token, voting, params, registry] = await instantiate();

        await registry.apply(web3.toHex('foobar'));
        first_listing_id = (await registry.list())[0];
        second_listing_id = undefined;

        await registry.setTime(1000000100);
        await registry.update_status(first_listing_id);
        assert.equal((await registry.get_info(first_listing_id))[0], 2);    // EXISTS

        await registry.edit(first_listing_id, web3.toHex('baz'));

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 3);   // EDIT
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], web3.toHex('baz'));   // edit_ipfs_hash
    });

    it("test edit can be accepted", async function() {
        await registry.setTime(1000000200);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 3);   // EDIT
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], true);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], web3.toHex('baz'));   // edit_ipfs_hash
    });

    it("test edit accepted", async function() {
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('baz'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash*/
    });
});
