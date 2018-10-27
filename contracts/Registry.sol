pragma solidity 0.4.25;

import "./IRegistry.sol";
import "installed_contracts/tokens/contracts/eip20/EIP20Interface.sol";
import "./Parameterizer.sol";
import "./IVoting.sol";
import "installed_contracts/zeppelin/contracts/math/SafeMath.sol";

contract Registry is IRegistry {

    // ------
    // EVENTS
    // ------

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, bytes ipfs_hash, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);
    event _Deposit(bytes32 indexed listingHash, uint added, uint newTotal, address indexed owner);
    event _Withdrawal(bytes32 indexed listingHash, uint withdrew, uint newTotal, address indexed owner);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ApplicationRemoved(bytes32 indexed listingHash);
    event _ListingRemoved(bytes32 indexed listingHash);
    event _ListingWithdrawn(bytes32 indexed listingHash, address indexed owner);
    event _TouchAndRemoved(bytes32 indexed listingHash);
    event _ChallengeFailed(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);
    event _ChallengeSucceeded(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);
    event _RewardClaimed(uint indexed challengeID, uint reward, address indexed voter);
    event _ExitInitialized(bytes32 indexed listingHash, uint exitTime, uint exitDelayEndDate, address indexed owner);
    event _StateChanged(bytes32 indexed listing_id, DAppState new_state);

    // ============
    // DATA STRUCTURES:
    // ============

    enum DAppState {
        // registry does not know about the dapp
        NOT_EXISTS,

        // application for inclusion to the registry is in progress
        APPLICATION,

        // dapp exists in the registry
        EXISTS,

        // application for edit of registry dapp is in progress
        EDIT,

        // submitter is calling of the dapp
        DELETING
    }

    using SafeMath for uint;

    struct Listing {
        uint ids_position;
        bytes ipfs_hash;
        address owner;          // Owner of Listing
        uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge

        DAppState state;

        uint applicationExpiry; // Expiration date of apply stage

        uint challengeID;       // Corresponds to a PollID in Voting

        uint exitTime;          // Time the listing may leave the registry
        uint exitTimeExpiry;    // Expiration date of exit period
    }

    struct Challenge {
        uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
        address challenger;     // Owner of Challenge
        bool resolved;          // Indication of if challenge is resolved
        uint stake;             // Number of tokens at stake for either party during challenge
        uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
        mapping(address => bool) tokenClaims; // Indicates whether a voter has claimed a reward yet
    }

    // ============
    // MODIFIERS:
    // ============

    modifier requiresState(bytes32 listing_id, Registry.DAppState state) {
        require(dappState(listing_id) == state);
        _;
    }

    // ============
    // GLOBAL STATE:
    // ============

    // Maps challengeIDs to associated challenge data
    mapping(uint => Challenge) public challenges;

    // Maps listingHashes to associated listingHash data
    mapping(bytes32 => Listing) public listings;

    bytes32[] public ids;

    // Global Variables
    EIP20Interface public token;
    IVoting public voting;
    Parameterizer public parameterizer;

    uint nonce;


    function Registry(address _token, address _voting, address _parameterizer) public {
        require(_token != 0 && address(token) == 0);
        require(_voting != 0 && address(voting) == 0);
        require(_parameterizer != 0 && address(parameterizer) == 0);

        token = EIP20Interface(_token);
        voting = IVoting(_voting);
        parameterizer = Parameterizer(_parameterizer);
    }

    // --------------------
    // PUBLISHER INTERFACE:
    // --------------------

    function apply(bytes ipfs_hash) public {
        bytes32 listing_id = keccak256(++nonce);
        assert(dappState(listing_id) == DAppState.NOT_EXISTS);

        uint token_amount = parameterizer.get("minDeposit");

        // Sets owner
        Listing storage listing = listings[listing_id];
        listing.ipfs_hash = ipfs_hash;
        listing.owner = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = time().add(parameterizer.get("applyStageLen"));
        listing.unstakedDeposit = token_amount;

        // Transfers tokens from user to Registry contract
        require(token.transferFrom(listing.owner, this, token_amount));

        // ids <-> listings linkage
        listing.ids_position = ids.length;
        ids.push(listing_id);

        changeState(listing_id, DAppState.APPLICATION);
        emit _Application(listing_id, token_amount, listing.applicationExpiry, ipfs_hash, msg.sender);
    }

    function edit(bytes32 listing_id, bytes new_ipfs_hash) public requiresState(listing_id, DAppState.EXISTS) {
        checkDAppInvariant(listing_id);
        // FIXME FIXME
    }

    function init_exit(bytes32 listing_id) public requiresState(listing_id, DAppState.EXISTS) {
        checkDAppInvariant(listing_id);
        Listing storage listing = listings[listing_id];

        require(msg.sender == listing.owner);
        // Cannot exit during ongoing challenge
        require(!challengeExists(listing_id));

        // Set when the listing may be removed from the whitelist
        listing.exitTime = time().add(parameterizer.get("exitTimeDelay"));
        // Set exit period end time
        listing.exitTimeExpiry = listing.exitTime.add(parameterizer.get("exitPeriodLen"));
        changeState(listing_id, DAppState.DELETING);

        emit _ExitInitialized(listing_id, listing.exitTime, listing.exitTimeExpiry, msg.sender);
    }

    // -----------------------
    // VIEW:
    // -----------------------

    function list() public view returns (bytes32[]) {
        return ids;
    }

    function get_info(bytes32 listing_id) public view returns
            (uint state, bool is_challenged /* many states can be challenged */,
            bool status_can_be_updated /* if update_status should be called */,
            bytes ipfs_hash, bytes edit_ipfs_hash /* empty if not editing */) {
        checkDAppInvariant(listing_id);
        edit_ipfs_hash = new bytes(0);
    }

    // -----------------------
    // MAINTENANCE:
    // -----------------------

    function can_update_status(bytes32 listing_id) public view returns (bool) {
        checkDAppInvariant(listing_id);
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        if (state == DAppState.APPLICATION) {
            if (listing.applicationExpiry >= time() && !challengeExists(listing_id))
                return true;
        }
        else if (state == DAppState.DELETING) {
            if (msg.sender == listing.owner &&
                    listing.exitTime < time() && time() < listing.exitTimeExpiry)
                return true;
        }
        else {
            // FIXME FIXME more states
            assert(state == DAppState.NOT_EXISTS);
            return false;
        }
    }

    // finish current operation
    function update_status(bytes32 listing_id) public {
        checkDAppInvariant(listing_id);
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        if (state == DAppState.APPLICATION) {
            if (listing.applicationExpiry >= time() && !challengeExists(listing_id))
                whitelistApplication(listing_id);
        }
        else if (state == DAppState.DELETING) {
            if (msg.sender == listing.owner &&
                    listing.exitTime < time() && time() < listing.exitTimeExpiry) {
                resetListing(listing_id);
                emit _ListingWithdrawn(listing_id, msg.sender);
            }
        }
        else {
            // FIXME FIXME more states
            assert(state == DAppState.NOT_EXISTS);
        }

        revert();
    }

    // -----------------------
    // TOKEN HOLDER INTERFACE:
    // -----------------------

    function challenge(bytes32 listing_id, uint state_check /* pass state seen by you to prevent race condition */) public {
        checkDAppInvariant(listing_id);
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        require(state == DAppState(state_check));
        require(state == DAppState.APPLICATION || state == DAppState.EXISTS || state == DAppState.EDIT);

        uint minDeposit = parameterizer.get("minDeposit");

        // Prevent multiple challenges
        require(!challengeExists(listing_id));

        // Starts poll
        uint pollID = voting.startPoll(
            parameterizer.get("voteQuorum"),
            parameterizer.get("commitStageLen"),
            parameterizer.get("revealStageLen")
        );

/*        uint oneHundred = 100; // Kludge that we need to use SafeMath
        challenges[pollID] = Challenge({
            challenger: msg.sender,
            rewardPool: ((oneHundred.sub(parameterizer.get("dispensationPct"))).mul(minDeposit)).div(100),
            stake: minDeposit,
            resolved: false,
            totalTokens: 0
        });

        // Updates listingHash to store most recent challenge
        listing.challengeID = pollID;

        // Locks tokens for listingHash during challenge
        listing.unstakedDeposit -= minDeposit;

        // Takes tokens from challenger
        require(token.transferFrom(msg.sender, this, minDeposit));

        (uint commitEndDate, uint revealEndDate,,,) = voting.pollMap(pollID);

        emit _Challenge(listing_id, pollID, _data, commitEndDate, revealEndDate, msg.sender);
        return pollID;*/
    }

    function challenge_status(bytes32 listing_id) public view returns
            (uint challenge_id, bool is_commit, bool is_reveal, uint votesFor /* 0 for commit phase */,
            uint votesAgainst /* 0 for commit phase */) {
        checkDAppInvariant(listing_id);

    }

    function commit_vote(bytes32 listing_id, bytes32 secret_hash) public {
        checkDAppInvariant(listing_id);

    }

    function reveal_vote(bytes32 listing_id, uint vote_option /* 1: for, other: against */, uint vote_stake, uint salt) public {
        checkDAppInvariant(listing_id);

    }

    // ----------------
    // TOKEN FUNCTIONS:
    // ----------------

    function claim_reward(uint challenge_id) public {
/*        Challenge storage challengeInstance = challenges[_challengeID];
        // Ensures the voter has not already claimed tokens and challengeInstance results have
        // been processed
        require(challengeInstance.tokenClaims[msg.sender] == false);
        require(challengeInstance.resolved == true);

        uint voterTokens = voting.getNumPassingTokens(msg.sender, _challengeID);
        uint reward = voterTokens.mul(challengeInstance.rewardPool)
                      .div(challengeInstance.totalTokens);

        // Subtracts the voter's information to preserve the participation ratios
        // of other voters compared to the remaining pool of rewards
        challengeInstance.totalTokens -= voterTokens;
        challengeInstance.rewardPool -= reward;

        // Ensures a voter cannot claim tokens again
        challengeInstance.tokenClaims[msg.sender] = true;

        require(token.transfer(msg.sender, reward));

        emit _RewardClaimed(_challengeID, reward, msg.sender);*/
    }

    // --------
    // GETTERS:
    // --------

    /**
    @dev                Calculates the provided voter's token reward for the given poll.
    @param _voter       The address of the voter whose reward balance is to be returned
    @param _challengeID The pollID of the challenge a reward balance is being queried for
    @return             The uint indicating the voter's reward
    */
    function voterReward(address _voter, uint _challengeID)
    public view returns (uint) {
        uint totalTokens = challenges[_challengeID].totalTokens;
        uint rewardPool = challenges[_challengeID].rewardPool;
        uint voterTokens = voting.getNumTokens(_voter, _challengeID);
        return voterTokens.mul(rewardPool).div(totalTokens);
    }

    /**
    @dev                Returns true if apply was called for this listingHash
    @param listing_id The listingHash whose status is to be examined
    */
    function appWasMade(bytes32 listing_id) view public returns (bool exists) {
        return listings[listing_id].applicationExpiry > 0;
    }

    /**
    @dev                Returns true if the application/listingHash has an unresolved challenge
    @param listing_id The listingHash whose status is to be examined
    */
    function challengeExists(bytes32 listing_id) view public returns (bool) {
        uint challengeID = listings[listing_id].challengeID;

        return (listings[listing_id].challengeID > 0 && !challenges[challengeID].resolved);
    }

    /**
    @dev                Determines whether voting has concluded in a challenge for a given
                        listingHash. Throws if no challenge exists.
    @param listing_id A listingHash with an unresolved challenge
    */
    function challengeCanBeResolved(bytes32 listing_id) view public returns (bool) {
        uint challengeID = listings[listing_id].challengeID;

        require(challengeExists(listing_id));

        return voting.pollEnded(challengeID);
    }

    /**
    @dev                Determines the number of tokens awarded to the winning party in a challenge.
    @param _challengeID The challengeID to determine a reward for
    */
    function determineReward(uint _challengeID) public view returns (uint) {
        require(!challenges[_challengeID].resolved && voting.pollEnded(_challengeID));

/*        // Edge case, nobody voted, give all tokens to the challenger.
        if (voting.getTotalNumberOfTokensForWinningOption(_challengeID) == 0) {
            return 2 * challenges[_challengeID].stake;
        }

        return (2 * challenges[_challengeID].stake) - challenges[_challengeID].rewardPool;
*/    }

    /**
    @dev                Getter for Challenge tokenClaims mappings
    @param _challengeID The challengeID to query
    @param _voter       The voter whose claim status to query for the provided challengeID
    */
    function tokenClaims(uint _challengeID, address _voter) public view returns (bool) {
        return challenges[_challengeID].tokenClaims[_voter];
    }

    // ----------------
    // PRIVATE FUNCTIONS:
    // ----------------

    /**
    @dev                Determines the winner in a challenge. Rewards the winner tokens and
                        either whitelists or de-whitelists the listingHash.
    @param listing_id A listingHash with a challenge that is to be resolved
    */
    function resolveChallenge(bytes32 listing_id) private {
        uint challengeID = listings[listing_id].challengeID;

        // Calculates the winner's reward,
        // which is: (winner's full stake) + (dispensationPct * loser's stake)
        uint reward = determineReward(challengeID);

        // Sets flag on challenge being processed
        challenges[challengeID].resolved = true;

        // Stores the total tokens used for voting by the winning side for reward purposes
//        challenges[challengeID].totalTokens =
//            voting.getTotalNumberOfTokensForWinningOption(challengeID);

        // Case: challenge failed
        if (voting.result(challengeID)) {
            whitelistApplication(listing_id);
            // Unlock stake so that it can be retrieved by the applicant
            listings[listing_id].unstakedDeposit += reward;

            emit _ChallengeFailed(listing_id, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
        // Case: challenge succeeded or nobody voted
        else {
            resetListing(listing_id);
            // Transfer the reward to the challenger
            require(token.transfer(challenges[challengeID].challenger, reward));

            emit _ChallengeSucceeded(listing_id, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
    }

    /**
    @dev                Called by updateStatus() if the applicationExpiry date passed without a
                        challenge being made. Called by resolveChallenge() if an
                        application/listing beat a challenge.
    @param listing_id The listingHash of an application/listingHash to be whitelisted
    */
    function whitelistApplication(bytes32 listing_id) private {
        listings[listing_id].applicationExpiry = 0;
        changeState(listing_id, DAppState.EXISTS);
        emit _ApplicationWhitelisted(listing_id);
    }

    /**
    @dev                Deletes a listingHash from the whitelist and transfers tokens back to owner
    @param listing_id The listing hash to delete
    */
    function resetListing(bytes32 listing_id) private {
        Listing storage listing = listings[listing_id];
        DAppState state_was = dappState(listing_id);

        // Deleting listing to prevent reentry
        address owner = listing.owner;
        uint unstakedDeposit = listing.unstakedDeposit;
        listing.owner = address(0);

        // ids <-> listings linkage
        uint removed_position = listings[listing_id].ids_position;
        assert(removed_position < ids.length);
        if (removed_position != ids.length - 1) {
            listings[ids[ids.length - 1]].ids_position = removed_position;
            ids[removed_position] = ids[ids.length - 1];
        }
        ids[ids.length - 1] = bytes32(0);
        ids.length--;

        changeState(listing_id, DAppState.NOT_EXISTS);
        delete listings[listing_id];
        
        // Transfers any remaining balance back to the owner
        if (unstakedDeposit > 0){
            require(token.transfer(owner, unstakedDeposit));
        }

        if (DAppState.APPLICATION == state_was) {
            emit _ApplicationRemoved(listing_id);
        } else {
            emit _ListingRemoved(listing_id);
        }
    }

    function dappState(bytes32 listing_id) internal view returns (Registry.DAppState) {
        return listings[listing_id].state;
    }

    function checkDAppInvariant(bytes32 listing_id) internal view {
        Listing storage listing = listings[listing_id];

        assert((listing.state == DAppState.NOT_EXISTS) == (listing.owner == address(0)));
        assert((listing.state == DAppState.APPLICATION) == (listing.applicationExpiry != 0));
        assert((listing.state == DAppState.DELETING) == (listing.exitTime != 0));
        assert((listing.state == DAppState.DELETING) == (listing.exitTimeExpiry != 0));

        if (listing.state == DAppState.DELETING || listing.state == DAppState.NOT_EXISTS)
            assert(!challengeExists(listing_id));

        assert(listing.ids_position < ids.length);
        assert(ids[listing.ids_position] == listing_id);
    }

    function changeState(bytes32 listing_id, DAppState new_state) internal {
        DAppState state = dappState(listing_id);
        assert(state != new_state);

        if (DAppState.NOT_EXISTS == state) {    assert(DAppState.APPLICATION == new_state); }
        else if (DAppState.APPLICATION == state) {    assert(DAppState.EXISTS == new_state || DAppState.NOT_EXISTS == new_state); }
        else if (DAppState.EXISTS == state) {   assert(DAppState.EDIT == new_state || DAppState.DELETING == new_state || DAppState.NOT_EXISTS == new_state); }
        else if (DAppState.EDIT == state) {     assert(DAppState.EXISTS == new_state); }
        else if (DAppState.DELETING == state) { assert(DAppState.NOT_EXISTS == new_state || DAppState.EXISTS == new_state); }
        else assert(false);

        listings[listing_id].state = new_state;
        _StateChanged(listing_id, new_state);
        checkDAppInvariant(listing_id);
    }


    function time() internal view returns (uint) {
        return now;
    }
}
