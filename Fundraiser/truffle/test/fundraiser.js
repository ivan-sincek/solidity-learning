const { expectRevert } = require("@openzeppelin/test-helpers");
const Fundraiser       = artifacts.require("Fundraiser");

contract("Fundraiser", (accounts) => {
	// ---------- CONTRACT
	let fundraiser       = null;
	// ---------- ACCOUNTS
	const custodian      = accounts[0]; // initial custodian (owner)
	const beneficiary    = accounts[1]; // initial beneficiary
	const beneficiaryNew = accounts[2]; // new beneficiary
	const philanthropist = accounts[3]; // initial philanthropist (donor)
	const hacker         = accounts[4]; // malicious actor
	const invalid        = "0x0000000000000000000000000000000000000000";
	// ---------- FUNDRAISER
	const name           = "GitHub Fundraiser";
	const description    = "If you found something useful on my GitHub profile, feel free to fund me in order to create even more stuff.";
	const website        = "https://github.com/ivan-sincek";
	const thumbnail      = "https://avatars.githubusercontent.com/u/35937483";
	// ---------- DONATION
	const amount         = web3.utils.toWei("0.03301", "ether");
	const amountZero     = web3.utils.toWei("0", "ether");

	describe("Deployments", async () => {
		it("Deploy Fundraiser Contract", async () => {
			const deployed = await Fundraiser.deployed();
			assert(deployed, "Fundraiser contract is not deployed.");
		});
	});
	describe("Initializations", async () => {
		beforeEach(async () => {
			fundraiser = await Fundraiser.new(custodian, beneficiary, name, description, website, thumbnail);
		});
		it("Get Custodian", async () => {
			const custodianCurrent = await fundraiser.getCustodian();
			assert.equal(custodianCurrent, custodian, "Current custodian does not match the initial custodian (owner).");
		});
		it("Get Beneficiary", async () => {
			const beneficiaryCurrent = await fundraiser.getBeneficiary();
			assert.equal(beneficiaryCurrent, beneficiary, "Current beneficiary does not match the initial beneficiary.");
		});
		it("Get Details", async () => {
			const detailsCurrent = await fundraiser.details();
			assert.equal(detailsCurrent.beneficiary, beneficiary, "Current beneficiary does not match the initial beneficiary.");
			assert.equal(detailsCurrent.name, name, "Current name does not match the initial name.");
			assert.equal(detailsCurrent.description, description, "Current description does not match the initial description.");
			assert.equal(detailsCurrent.website, website, "Current website does not match the initial website.");
			assert.equal(detailsCurrent.thumbnail, thumbnail, "Current thumbnail does not match the initial thumbnail.");
		});
		it("Set New Beneficiary as Custodian", async () => {
			await fundraiser.setBeneficiary(beneficiaryNew, { from: custodian });
			const beneficiaryCurrent = await fundraiser.getBeneficiary();
			assert.equal(beneficiaryCurrent, beneficiaryNew, "Current beneficiary does not match the new beneficiary.");
		});
		it("Set New Beneficiary as Non-Custodian", async () => {
			try {
				await fundraiser.setBeneficiary(beneficiaryNew, { from: hacker });
				assert.fail("Anyone can set a new beneficiary.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Ownable: caller is not the owner"; // from @openzeppelin
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
		it("Set Zero Address as Custodian", async () => {
			try {
				await fundraiser.setBeneficiary(invalid, { from: custodian });
				assert.fail("Address must not be zero address.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Address must not be zero address.";
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
		it("Set New Beneficiary Event", async () => {
			const tx = await fundraiser.setBeneficiary(beneficiaryNew, { from: custodian });
			const eventCurrent = tx.logs[0].event;
			const eventExpected = "BeneficiaryChanged";
			assert.equal(eventCurrent, eventExpected, "Current event does not match the expected event.");
		});
	});

	describe("Make Donations", async () => {
		beforeEach(async () => {
			fundraiser = await Fundraiser.new(custodian, beneficiary, name, description, website, thumbnail);
		});
		it("Donate Using receive()", async () => {
			const exceptionExpected = "receive() is disabled, please use donate().";
			await expectRevert(web3.eth.sendTransaction({ from: philanthropist, to: fundraiser.address, value: amount, data: null }), exceptionExpected);
		});
		it("Donate Using fallback()", async () => {
			const exceptionExpected = "fallback() is disabled, please use donate().";
			await expectRevert(web3.eth.sendTransaction({ from: philanthropist, to: fundraiser.address, value: amount, data: "0x1234" }), exceptionExpected);
		});
		it("Donate Zero Amount", async () => {
			try {
				await fundraiser.donate({ from: philanthropist, value: amountZero });
				assert.fail("Zero amount is allowed.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Recieve amount must be grater than zero.";
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
		it("Donate Non-Zero Amount (Combined)", async () => {
			const raisedOld = await fundraiser.raised();
			const countOld = await fundraiser.count();
			const balanceOld = await web3.eth.getBalance(fundraiser.address);
			await fundraiser.donate({ from: philanthropist, value: amount });
			const raisedCurrent = await fundraiser.raised();
			const countCurrent = await fundraiser.count();
			const balanceCurrent = await web3.eth.getBalance(fundraiser.address);
			assert.equal(raisedCurrent - raisedOld, amount, "Total raised amount is not incremented properly.");
			assert.equal(countCurrent - countOld, 1, "Total donations count is not incremented properly.");
			assert.equal(balanceCurrent - balanceOld, raisedCurrent - raisedOld, "Current balance does not match the total raised amount.");
		});
		it("Donate Non-Zero Amount (Individual)", async () => {
			const raisedOld = await fundraiser.myRaised({ from: philanthropist });
			const countOld = await fundraiser.myCount({ from: philanthropist });
			const balanceOld = await web3.eth.getBalance(fundraiser.address);
			await fundraiser.donate({ from: philanthropist, value: amount });
			const raisedCurrent = await fundraiser.myRaised({ from: philanthropist });
			const countCurrent = await fundraiser.myCount({ from: philanthropist });
			const balanceCurrent = await web3.eth.getBalance(fundraiser.address);
			assert.equal(raisedCurrent - raisedOld, amount, "My total raised amount is not incremented properly.");
			assert.equal(countCurrent - countOld, 1, "My total donations count is not incremented properly.");
			assert.equal(balanceCurrent - balanceOld, raisedCurrent - raisedOld, "Current balance does not match my total raised amount.");
		});
		it("Donate Event", async () => {
			const tx = await fundraiser.donate({ from: philanthropist, value: amount });
			const eventCurrent = tx.logs[0].event;
			const eventExpected = "DonationReceived";
			assert.equal(eventCurrent, eventExpected, "Current event does not match the expected event.");
		});
		it("Pause Donating as Custodian", async () => {
			await fundraiser.pause({ from: custodian });
			try {
				await fundraiser.donate({ from: philanthropist, value: amount });
				assert.fail("Donating is not paused.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Pausable: paused"; // from @openzeppelin
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
		it("Pause Donating as Non-Custodian", async () => {
			try {
				await fundraiser.pause({ from: hacker });
				assert.fail("Anyone can pause donating.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Ownable: caller is not the owner"; // from @openzeppelin
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
	});

	describe("List Donations", async () => {
		beforeEach(async () => {
			fundraiser = await Fundraiser.new(custodian, beneficiary, name, description, website, thumbnail);
		});
		it("Get All My Donations", async () => {
			const donationsOld = await fundraiser.myDonations({ from: philanthropist });
			await fundraiser.donate({ from: philanthropist, value: amount });
			const donationsCurrent = await fundraiser.myDonations({ from: philanthropist });
			assert.equal(donationsCurrent.length - donationsOld.length, 1, "My total donations count is not correct.");
			assert.equal(donationsCurrent[0].amount, amount, "Stored amount does not match the donated amount.");
		});
	});

	describe("Transfer Donations", async () => {
		beforeEach(async () => {
			fundraiser = await Fundraiser.new(custodian, beneficiary, name, description, website, thumbnail);
		});
		async function getBalance(address) {
			return web3.utils.toBN(await web3.eth.getBalance(address));
		}
		it("Transfer Current Ballance as Custodian", async () => {
			await fundraiser.donate({ from: philanthropist, value: amount });
			const balanceOld = await getBalance(fundraiser.address);
			const beneficiaryBalanceOld = await getBalance(beneficiary);
			await fundraiser.withdraw({ from: custodian });
			const balanceCurrent = await getBalance(fundraiser.address);
			const beneficiaryBalanceCurrent = await getBalance(beneficiary);
			assert.equal(balanceCurrent.sub(balanceOld), -amount, "The whole amount is not transferred.");
			assert.equal(beneficiaryBalanceCurrent.sub(beneficiaryBalanceOld), amount, "Beneficiary received an incorrect amount.");
		});
		it("Transfer Current Ballance as Non-Custodian", async () => {
			await fundraiser.donate({ from: philanthropist, value: amount });
			try {
				await fundraiser.withdraw({ from: hacker });
				assert.fail("Anyone can transfer the current ballance to the beneficiary.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Ownable: caller is not the owner"; // from @openzeppelin
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
		it("Transfer Zero Amount", async () => {
			try {
				await fundraiser.withdraw({ from: custodian });
				assert.fail("Zero amount is allowed.");
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "Send amount must be grater than zero.";
				assert.equal(exceptionCurrent, exceptionExpected, "Current exception does not match the expected exception.");
			}
		});
		it("Transfer Event", async () => {
			await fundraiser.donate({ from: philanthropist, value: amount });
			const tx = await fundraiser.withdraw({ from: custodian });
			const eventCurrent = tx.logs[0].event;
			const eventExpected = "TransferredToBeneficiary";
			assert.equal(eventCurrent, eventExpected, "Current event does not match the expected event.");
		});
	});
});
