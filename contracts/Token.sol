pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Token is ERC20, StandardToken {

    string public constant tokenName = "DApp Registry Token";
    string public constant symbol = "DRT";
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 1000000 * (uint(10) ** uint(decimals));

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }
}
