// SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0 <=0.8.19; // NOTE: Contracts should be deployed with the same compiler version and flags that they have been tested the most with.
pragma solidity 0.8.19;

// import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Fundraiser is Ownable, Pausable, ReentrancyGuard {
    // using SafeMath for uint256; // NOTE: Not needed in "solidity >=0.8.0".

    // TO DO: Add more properties.
    struct Details {
        address payable beneficiary;
        string name;
        string description;
        string website;
        string thumbnail;
    }
    Details public details;

    struct Total {
        uint256 raised;
        uint256 count;
    }
    Total private _combined;
    mapping(address => Total) private _individuals;

    // TO DO: Add more properties.
    struct Donation {
        uint256 amount;
        uint256 timestamp;
    }
    mapping(address => Donation[]) private _donations;

    event BeneficiaryChanged(address indexed beneficiaryOld, address indexed beneficiaryNew);
    event DonationReceived(address indexed philanthropist, uint256 amount);
    event TransferredToBeneficiary(uint256 amount);

    // error BurnableAddress(); // NOTE: "error" costs less gas than "require".
    // error ZeroReceive();
    // error ZeroSend();

    modifier nonBurnableAddress(address addr) {
        // if (_address == address(0)) {
        //     revert BurnableAddress();
        // }
        require(addr != address(0), "Address must not be zero address.");
        _;
    }

    modifier nonZeroReceive() {
        // if (msg.value > 0) {
        //     revert ZeroReceive();
        // }
        require(msg.value > 0, "Recieve amount must be grater than zero.");
        _;
    }

    modifier nonZeroSend() {
        // if (msg.value > 0) {
        //     revert ZeroSend();
        // }
        require(address(this).balance > 0, "Send amount must be grater than zero.");
        _;
    }

    constructor(address custodian, address payable beneficiary, string memory name, string memory description, string memory website, string memory thumbnail) {
        _transferOwnership(custodian); // from owner to custodian
        details.beneficiary = beneficiary;
        details.name = name;
        details.description = description;
        details.website = website;
        details.thumbnail = thumbnail;
    }

    // NOTE: All methods are external and not public in order to reduce the gas cost.

    function getCustodian() external view returns (address) {
        return owner();
    }

    function getBeneficiary() external view returns (address) {
        return details.beneficiary;
    }

    function setBeneficiary(address payable beneficiaryNew) external onlyOwner nonBurnableAddress(beneficiaryNew) {
        emit BeneficiaryChanged(details.beneficiary, beneficiaryNew);
        details.beneficiary = beneficiaryNew;
    }

    function raised() external view returns (uint256) {
        return _combined.raised;
    }

    function count() external view returns (uint256) {
        return _combined.count;
    }

    function myRaised() external view returns (uint256) {
        return _individuals[msg.sender].raised;
    }

    function myCount() external view returns (uint256) {
        return _individuals[msg.sender].count;
    }

    // TO DO: Make a pagination.
    function myDonations() external view returns (Donation[] memory) {
        return _donations[msg.sender];
    }

    function donate() external payable whenNotPaused nonZeroReceive {
        emit DonationReceived(msg.sender, msg.value);
        _combined.raised += msg.value;
        _combined.count++;
        _individuals[msg.sender].raised += msg.value;
        _individuals[msg.sender].count++;
        _donations[msg.sender].push(
            Donation({
                amount: msg.value,
                timestamp: block.timestamp // NOTE: "block.timestamp" should not be trusted, but it does not matter for this kind of use.
            })
        );
    }

    receive() external payable {
        revert("receive() is disabled, please use donate().");
    }

    fallback() external payable {
        revert("fallback() is disabled, please use donate().");
    }

    function withdraw() external onlyOwner nonZeroSend nonReentrant {
        emit TransferredToBeneficiary(address(this).balance);
        // details.beneficiary.transfer(address(this).balance); // NOTE: "transfer()" should be avoided because the gas cost may change in the future causing a possible reentrancy attack.
        (bool success, ) = details.beneficiary.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function pause() external onlyOwner {
        // selfdestruct(details.beneficiary); // NOTE: "selfdestruct()" should be avoided, use "Pausable" instead.
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
