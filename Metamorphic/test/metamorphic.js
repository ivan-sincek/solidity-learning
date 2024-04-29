const Creator = artifacts.require("Creator");

contract("Metamorphic", (accounts) => {
	const salt   = 1234;
	const user   = accounts[0];
	const hacker = accounts[1];
	const amount = web3.utils.toWei("0.03301");

	describe("Metamorphic Malware", async () => {
		it("Deploy Creator Contract", async () => {
			let deployed = await Creator.deployed();
			assert(deployed, "Creator contract is not deployed.");
		});
		it("Validate Same Addresses", async () => {
			const contract = await Creator.new();
			// ----------
			const txFirst = await contract.create(salt);
			const addressProxyFirst = txFirst.logs[1].args["addressProxy"];
			const addressTargetFirst = txFirst.logs[4].args["addressTarget"];
			await contract.destroy();
			// ----------
			const txSecond = await contract.create(salt);
			const addressProxySecond = txSecond.logs[1].args["addressProxy"];
			const addressTargetSecond = txSecond.logs[4].args["addressTarget"];
			await contract.destroy();
			// ----------
			assert.equal(addressProxyFirst, addressProxySecond, "Proxy contract was not deployed to the same address.");
			assert.equal(addressTargetFirst, addressTargetSecond, "Target contract was not deployed to the same address.");
		});
		async function getBalance(address) {
			return web3.utils.toBN(await web3.eth.getBalance(address));
		}
		it("Metamorph", async () => {
			const contract = await Creator.new({ from: hacker });
			// ----------
			const tx = await contract.create(salt, { from: hacker });
			const addressTarget = tx.logs[4].args["addressTarget"];
			await web3.eth.sendTransaction({ from: user, to: addressTarget, value: amount, data: null });
			const balanceOld = await web3.eth.getBalance(addressTarget);
			await contract.destroy({ from: hacker });
			// ----------
			await contract.create(salt, { from: hacker });
			const balanceNew = await web3.eth.getBalance(addressTarget);
			// ----------
			assert.equal(balanceOld - amount, balanceNew, "Target contract balance should not persists.");
		});
	});
});
