pragma solidity ^0.4.24;

interface IRegistry {

    // states: NOT_EXISTS (0); APPLICATION (1); EXISTS (2); EDIT (3); DELETING (4)

    // transitions:
    // NOT_EXISTS -> APPLICATION
    // APPLICATION -> EXISTS | NOT_EXISTS
    // EXISTS -> EDIT | DELETING | NOT_EXISTS
    // EDIT -> EXISTS
    // DELETING -> NOT_EXISTS | EXISTS


    // ADDING & EDITING

    // add new dapp to the registry
    function apply(bytes ipfs_hash) public; // STATES: NOT_EXISTS

    // edit existing dapp meta info
    function edit(bytes32 listing_id, bytes new_ipfs_hash) public;    // STATES: EXISTS

    // remove dapp added by you
    function init_exit(bytes32 listing_id) public; // STATES: EXISTS


    // VIEW

    // list the registry
    function list() public view returns (bytes32[] ids);

    function get_info(bytes32 listing_id) public view returns
        (uint state, bool is_challenged /* many states can be challenged */,
        bool status_can_be_updated /* if update_status should be called */,
        bytes ipfs_hash, bytes edit_ipfs_hash /* empty if not editing */);


    // MAINTENANCE

    function can_update_status(bytes32 listing_id) public view returns (bool);

    // finish current operation
    function update_status(bytes32 listing_id) public; // only if can_update_status(listing_id)


    // CHALLENGES

    // open challenge for a dapp
    function challenge(bytes32 listing_id, uint state_check /* pass state seen by you to prevent race condition */) public;    // STATES:

    // status of a challenge
    function challenge_status(bytes32 listing_id) public view returns
        (uint challenge_id, bool is_commit, bool is_reveal, uint votesFor /* 0 for commit phase */,
        uint votesAgainst /* 0 for commit phase */);    // only for challenged

    function commit_vote(bytes32 listing_id, bytes32 secret_hash) public;  // only for challenged

    function reveal_vote(bytes32 listing_id, uint vote_option /* 1: for, other: against */, uint vote_stake, uint salt) public;  // only for challenged

    // claim challenge reward
    function claim_reward(uint challenge_id) public;
}
