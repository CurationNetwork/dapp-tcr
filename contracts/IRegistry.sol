pragma solidity 0.4.25;


interface IRegistry {

    // ADDING & EDITING

    // add new dapp to the registry
    function apply(bytes ipfs_hash) public;

    // edit existing dapp meta info
    function edit(bytes32 _listingHash, bytes new_ipfs_hash) public;


    // VIEW

    // list the registry
    function list() public view returns (bytes32[] ids);

    function get_info(bytes32 _listingHash) public view returns
        (bool exists, bool is_application, bool is_challenged /* application and edit can be challenged */,
        bool is_editing, bool is_exiting,
        bool status_can_be_updated /* if updateStatus should be called */,
        bytes ipfs_hash, bytes edit_ipfs_hash /* empty if not editing */);

    // status of a challenge
    function challenge_status(bytes32 _listingHash) public view returns
        (uint challenge_id, bool is_commit, bool is_reveal, uint votesFor /* 0 for commit phase */,
        uint votesAgainst /* 0 for commit phase */);


    // remove dapp added by you
    function initExit(bytes32 _listingHash) public;

    // finish current operation
    function updateStatus(bytes32 _listingHash) public;


    // CHALLENGES

    // open challenge for a dapp
    function challenge(bytes32 _listingHash) public;

    function commitVote(bytes32 _listingHash, bytes32 _secretHash) public;

    function revealVote(bytes32 _listingHash, uint _voteOption /* 1: for, other: against */, uint _voteStake, uint _salt) public;

    // claim challenge reward
    function claimReward(uint challenge_id) public;
}
