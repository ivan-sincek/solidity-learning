// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract Upgradeable {
    uint256 public x;

    function initialize(uint256 _x) public {
        x = _x;
    }
}
