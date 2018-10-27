pragma solidity 0.4.25;

import "installed_contracts/tokens/contracts/eip20/EIP20Interface.sol";
import "installed_contracts/zeppelin/contracts/token/StandardToken.sol";

contract Token is EIP20Interface, StandardToken {

    string public constant tokenName = "DApp Registry Token";
    string public constant symbol = "DRT";
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 1000000 * (uint(10) ** uint(decimals));

    constructor() public {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }
}
