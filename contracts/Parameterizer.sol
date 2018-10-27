pragma solidity 0.4.25;

import "installed_contracts/zeppelin/contracts/math/SafeMath.sol";

contract Parameterizer {

    // ------
    // EVENTS
    // ------

    // ------
    // DATA STRUCTURES
    // ------

    using SafeMath for uint;

    // ------
    // STATE
    // ------

    bool public initialized;
    mapping(bytes32 => uint) public params;

    /**
    @dev Initializer        Can only be called once
    @notice _parameters     array of canonical parameters
    */
    function init(
        uint[] _parameters
    ) public {
        require(!initialized);
        initialized = true;

        // minimum deposit for listing to be whitelisted
        set("minDeposit", _parameters[0]);
        
        // minimum deposit to propose a reparameterization
        set("pMinDeposit", _parameters[1]);

        // period over which applicants wait to be whitelisted
        set("applyStageLen", _parameters[2]);

        // period over which reparmeterization proposals wait to be processed
        set("pApplyStageLen", _parameters[3]);

        // length of commit period for voting
        set("commitStageLen", _parameters[4]);
        
        // length of commit period for voting in parameterizer
        set("pCommitStageLen", _parameters[5]);
        
        // length of reveal period for voting
        set("revealStageLen", _parameters[6]);

        // length of reveal period for voting in parameterizer
        set("pRevealStageLen", _parameters[7]);

        // percentage of losing party's deposit distributed to winning party
        set("dispensationPct", _parameters[8]);

        // percentage of losing party's deposit distributed to winning party in parameterizer
        set("pDispensationPct", _parameters[9]);

        // type of majority out of 100 necessary for candidate success
        set("voteQuorum", _parameters[10]);

        // type of majority out of 100 necessary for proposal success in parameterizer
        set("pVoteQuorum", _parameters[11]);

        // minimum length of time user has to wait to exit the registry 
        set("exitTimeDelay", _parameters[12]);

        // maximum length of time user can wait to exit the registry
        set("exitPeriodLen", _parameters[13]);
    }

    // --------
    // GETTERS
    // --------

    /**
    @notice gets the parameter keyed by the provided name value from the params mapping
    @param _name the key whose value is to be determined
    */
    function get(string _name) public view returns (uint value) {
        return params[keccak256(abi.encodePacked(_name))];
    }

    // ----------------
    // PRIVATE FUNCTIONS
    // ----------------

    /**
    @dev sets the param keted by the provided name to the provided value
    @param _name the name of the param to be set
    @param _value the value to set the param to be set
    */
    function set(string _name, uint _value) private {
        params[keccak256(abi.encodePacked(_name))] = _value;
    }
}

