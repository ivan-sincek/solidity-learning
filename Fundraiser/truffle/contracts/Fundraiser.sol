// SPDX-License-Identifier: MITF
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
	Details public information;

	struct Total {
		uint256 raised;
		uint256 count;
	}
	Total private combined;
	mapping(address => Total) private individual;

	// TO DO: Add more properties.
	struct Donation {
		uint256 amount;
		uint256 timestamp;
	}
	mapping(address => Donation[]) private donations;

	event BeneficiaryChanged(address indexed _beneficiaryOld, address indexed _beneficiaryNew);
	event DonationReceived(address indexed _philanthropist, uint256 _amount);
	event TransferredToBeneficiary(uint256 _amount);

	modifier nonBurnable(address _address) {
		require(_address != address(0), "Zero address is allowed.");
		_;
	}

	modifier nonZeroReceive() {
		require(msg.value > 0, "Recieve amount must be grater than zero.");
		_;
	}

	modifier nonZeroSend() {
		require(address(this).balance > 0, "Send amount must be grater than zero.");
		_;
	}

	constructor(address _custodian, address payable _beneficiary, string memory _name, string memory _description, string memory _website, string memory _thumbnail) {
		transferOwnership(_custodian);
		information.beneficiary = _beneficiary;
		information.name        = _name;
		information.description = _description;
		information.website     = _website;
		information.thumbnail   = _thumbnail;
	}

	// NOTE: All methods are external and not public in order to reduce the gas cost.

	function custodian() external view returns(address) {
		return owner();
	}

	function beneficiary() external view returns(address) {
		return information.beneficiary;
	}

	function setBeneficiary(address payable _beneficiary) external onlyOwner nonBurnable(_beneficiary) {
		emit BeneficiaryChanged(information.beneficiary, _beneficiary);
		information.beneficiary = _beneficiary;
	}

	function raised() external view returns(uint256) {
		return combined.raised;
	}

	function count() external view returns(uint256) {
		return combined.count;
	}

	function myRaised() external view returns(uint256) {
		return individual[msg.sender].raised;
	}

	function myCount() external view returns(uint256) {
		return individual[msg.sender].count;
	}

	// TO DO: Make a pagination.
	function myDonations() external view returns(Donation[] memory) {
		return donations[msg.sender];
	}

	function donate() external payable whenNotPaused nonZeroReceive {
		emit DonationReceived(msg.sender, msg.value);
		combined.raised += msg.value;
		combined.count++;
		individual[msg.sender].raised += msg.value;
		individual[msg.sender].count++;
		donations[msg.sender].push(
			Donation({
				amount: msg.value,
				timestamp: block.timestamp // NOTE: "block.timestamp" should not be trusted, but it does not matter for this use.
			}
		));
	}

	receive() external payable {
		revert("receive() is disabled, please use donate().");
	}

	fallback() external payable {
		revert("fallback() is disabled, please use donate().");
	}

	function withdraw() external onlyOwner nonZeroSend nonReentrant {
		emit TransferredToBeneficiary(address(this).balance);
		// information.beneficiary.transfer(address(this).balance); // NOTE: "transfer()" should be avoided because the gas cost may change in the future causing a possible reentrancy attack.
		(bool success, ) = information.beneficiary.call{value: address(this).balance}("");
		require(success, "Transfer failed.");
	}

	function pause() external onlyOwner {
		// selfdestruct(information.beneficiary); // NOTE: "selfdestruct()" should be avoided, use "Pausable" instead.
		_pause();
	}

	function unpause() external onlyOwner {
		_unpause();
	}

}
