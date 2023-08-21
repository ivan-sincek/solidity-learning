const DiamondProxy = artifacts.require("DiamondProxy");

contract("DiamondProxy", (accounts) => {
	describe("Deployments", async () => {
		it("Deploy DiamondProxy Contract", async () => {
			const deployed = await DiamondProxy.deployed();
			assert(deployed, "DiamondProxy contract is not deployed.");
		});
	});
});
