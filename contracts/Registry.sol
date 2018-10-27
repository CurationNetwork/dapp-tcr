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
        bytes ipfs_hash;
        address owner;          // Owner of Listing
        uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge

        uint applicationExpiry; // Expiration date of apply stage
        bool whitelisted;       // Indicates registry status

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

    modifier requiresState(bytes32 _listingHash, Registry.DAppState state) {
        require(dappState(_listingHash) == state);
        _;
    }

    // ============
    // GLOBAL STATE:
    // ============

    // Maps challengeIDs to associated challenge data
    mapping(uint => Challenge) public challenges;

    // Maps listingHashes to associated listingHash data
    mapping(bytes32 => Listing) public listings;

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
        bytes32 _listingHash = keccak256(++nonce);
        assert(dappState(_listingHash) == DAppState.NOT_EXISTS);

        uint token_amount = parameterizer.get("minDeposit");

        // Sets owner
        Listing storage listing = listings[_listingHash];
        listing.ipfs_hash = ipfs_hash;
        listing.owner = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = block.timestamp.add(parameterizer.get("applyStageLen"));
        listing.unstakedDeposit = token_amount;

        // Transfers tokens from user to Registry contract
        require(token.transferFrom(listing.owner, this, token_amount));

        assert(dappState(_listingHash) == DAppState.APPLICATION);
        emit _Application(_listingHash, token_amount, listing.applicationExpiry, ipfs_hash, msg.sender);
    }

    function edit(bytes32 listing_id, bytes new_ipfs_hash) public {

    }

    function init_exit(bytes32 listing_id) public {
/*        Listing storage listing = listings[_listingHash];

        require(msg.sender == listing.owner);
        require(isWhitelisted(_listingHash));
        // Cannot exit during ongoing challenge
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        // Ensure user never initializedExit or exitPeriodLen passed
        require(listing.exitTime == 0 || now > listing.exitTimeExpiry);

        // Set when the listing may be removed from the whitelist
        listing.exitTime = now.add(parameterizer.get("exitTimeDelay"));
	// Set exit period end time
	listing.exitTimeExpiry = listing.exitTime.add(parameterizer.get("exitPeriodLen"));
        emit _ExitInitialized(_listingHash, listing.exitTime,
            listing.exitTimeExpiry, msg.sender);*/
    }

/*    function finalizeExit(bytes32 _listingHash) external {
        Listing storage listing = listings[_listingHash];

        require(msg.sender == listing.owner);
        require(isWhitelisted(_listingHash));
        // Cannot exit during ongoing challenge
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        // Make sure the exit was initialized
        require(listing.exitTime > 0);
        // Time to exit has to be after exit delay but before the exitPeriodLen is over 
	require(listing.exitTime < now && now < listing.exitTimeExpiry);

        resetListing(_listingHash);
        emit _ListingWithdrawn(_listingHash, msg.sender);
    }*/

    // -----------------------
    // VIEW:
    // -----------------------

    function list() public view returns (bytes32[] ids) {
        return new bytes32[](0);
    }

    function get_info(bytes32 listing_id) public view returns
            (uint state, bool is_challenged /* many states can be challenged */,
            bool status_can_be_updated /* if update_status should be called */,
            bytes ipfs_hash, bytes edit_ipfs_hash /* empty if not editing */) {
        edit_ipfs_hash = new bytes(0);
    }

    // -----------------------
    // MAINTENANCE:
    // -----------------------

    function can_update_status(bytes32 listing_id) public view returns (bool) {
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        if (state == DAppState.APPLICATION) {
            if (listing.applicationExpiry >= now && !challengeExists(listing_id))
                return true;
        }
        else {
            assert(state == DAppState.NOT_EXISTS);
            return false;
        }
    }

    // finish current operation
    function update_status(bytes32 listing_id) public {
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        if (state == DAppState.APPLICATION) {
            if (listing.applicationExpiry >= now && !challengeExists(listing_id))
                whitelistApplication(listing_id);
        }
        else {
            assert(state == DAppState.NOT_EXISTS);
        }
    }

    // -----------------------
    // TOKEN HOLDER INTERFACE:
    // -----------------------

    function challenge(bytes32 listing_id, uint state_check /* pass state seen by you to prevent race condition */) public {
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

        emit _Challenge(_listingHash, pollID, _data, commitEndDate, revealEndDate, msg.sender);
        return pollID;*/
    }

    function challenge_status(bytes32 listing_id) public view returns
            (uint challenge_id, bool is_commit, bool is_reveal, uint votesFor /* 0 for commit phase */,
            uint votesAgainst /* 0 for commit phase */) {

    }

    function commit_vote(bytes32 listing_id, bytes32 secret_hash) public {

    }

    function reveal_vote(bytes32 listing_id, uint vote_option /* 1: for, other: against */, uint vote_stake, uint salt) public {

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
    @dev                Determines whether the given listingHash be whitelisted.
    @param _listingHash The listingHash whose status is to be examined
    */
    function canBeWhitelisted(bytes32 _listingHash) view public returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;

        // Ensures that the application was made,
        // the application period has ended,
        // the listingHash can be whitelisted,
        // and either: the challengeID == 0, or the challenge has been resolved.
        if (
            appWasMade(_listingHash) &&
            listings[_listingHash].applicationExpiry < now &&
            !isWhitelisted(_listingHash) &&
            (challengeID == 0 || challenges[challengeID].resolved == true)
        ) { return true; }

        return false;
    }

    /**
    @dev                Returns true if the provided listingHash is whitelisted
    @param _listingHash The listingHash whose status is to be examined
    */
    function isWhitelisted(bytes32 _listingHash) view public returns (bool whitelisted) {
        return listings[_listingHash].whitelisted;
    }

    /**
    @dev                Returns true if apply was called for this listingHash
    @param _listingHash The listingHash whose status is to be examined
    */
    function appWasMade(bytes32 _listingHash) view public returns (bool exists) {
        return listings[_listingHash].applicationExpiry > 0;
    }

    /**
    @dev                Returns true if the application/listingHash has an unresolved challenge
    @param _listingHash The listingHash whose status is to be examined
    */
    function challengeExists(bytes32 _listingHash) view public returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;

        return (listings[_listingHash].challengeID > 0 && !challenges[challengeID].resolved);
    }

    /**
    @dev                Determines whether voting has concluded in a challenge for a given
                        listingHash. Throws if no challenge exists.
    @param _listingHash A listingHash with an unresolved challenge
    */
    function challengeCanBeResolved(bytes32 _listingHash) view public returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;

        require(challengeExists(_listingHash));

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
    @param _listingHash A listingHash with a challenge that is to be resolved
    */
    function resolveChallenge(bytes32 _listingHash) private {
        uint challengeID = listings[_listingHash].challengeID;

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
            whitelistApplication(_listingHash);
            // Unlock stake so that it can be retrieved by the applicant
            listings[_listingHash].unstakedDeposit += reward;

            emit _ChallengeFailed(_listingHash, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
        // Case: challenge succeeded or nobody voted
        else {
            resetListing(_listingHash);
            // Transfer the reward to the challenger
            require(token.transfer(challenges[challengeID].challenger, reward));

            emit _ChallengeSucceeded(_listingHash, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
    }

    /**
    @dev                Called by updateStatus() if the applicationExpiry date passed without a
                        challenge being made. Called by resolveChallenge() if an
                        application/listing beat a challenge.
    @param _listingHash The listingHash of an application/listingHash to be whitelisted
    */
    function whitelistApplication(bytes32 _listingHash) private {
        if (!listings[_listingHash].whitelisted) { emit _ApplicationWhitelisted(_listingHash); }
        listings[_listingHash].whitelisted = true;
        listings[_listingHash].applicationExpiry = 0;
    }

    /**
    @dev                Deletes a listingHash from the whitelist and transfers tokens back to owner
    @param _listingHash The listing hash to delete
    */
    function resetListing(bytes32 _listingHash) private {
        Listing storage listing = listings[_listingHash];

        // Emit events before deleting listing to check whether is whitelisted
        if (listing.whitelisted) {
            emit _ListingRemoved(_listingHash);
        } else {
            emit _ApplicationRemoved(_listingHash);
        }

        // Deleting listing to prevent reentry
        address owner = listing.owner;
        uint unstakedDeposit = listing.unstakedDeposit;
        delete listings[_listingHash];
        
        // Transfers any remaining balance back to the owner
        if (unstakedDeposit > 0){
            require(token.transfer(owner, unstakedDeposit));
        }
    }

    function dappState(bytes32 _listingHash) internal view returns (Registry.DAppState) {
        Listing storage listing = listings[_listingHash];

        if (address(0) == listing.owner)
            return DAppState.NOT_EXISTS;

        if (appWasMade(_listingHash))
            return DAppState.APPLICATION;

        assert(isWhitelisted(_listingHash));
        return DAppState.EXISTS;
    }
}
