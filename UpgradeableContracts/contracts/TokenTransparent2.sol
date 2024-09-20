// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:oz-upgrades-from TokenTransparent1
contract TokenTransparent2 is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable {

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initializeV2(address initialOwner, uint256 initialSupply) reinitializer(2) public {
        __ERC20_init("TokenTransparent2", "TT2");
        __ERC20Burnable_init();
        __Ownable_init(initialOwner);

        // _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function hello() external returns (string memory) {
        return "hello";
    }
}
