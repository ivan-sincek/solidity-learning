// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Gatekeeper {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)), "Gatekeeper: invalid gateThree part one");
        require(uint32(uint64(_gateKey)) != uint64(_gateKey), "Gatekeeper: invalid gateThree part two");
        require(uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)), "Gatekeeper: invalid gateThree part three");
        _;
    }

    function enter(
        bytes8 _gateKey
    ) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}
