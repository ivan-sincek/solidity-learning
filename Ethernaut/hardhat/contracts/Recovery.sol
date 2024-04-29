// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./SimpleToken.sol";

contract Recovery {
    // generate tokens
    function generateToken(string memory _name, uint256 _initialSupply) public {
        new SimpleToken(_name, msg.sender, _initialSupply);
    }
}
