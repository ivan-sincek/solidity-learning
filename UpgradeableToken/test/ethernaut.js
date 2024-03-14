describe("Upgradeable Tokens", function () {
	let owner = null;

	before(async () => {
		[owner] = await ethers.getSigners();
	});

	describe("UpgradeableToken1", async () => {
		it("Deploy", async () => {
			const contractFactory = await ethers.getContractFactory("UpgradeableToken1");
			const proxy = await upgrades.deployProxy(contractFactory, [owner.address], {
				initializer: "initialize",
				kind: "uups"
			});
			await proxy.waitForDeployment();
			console.log(proxy.target);
		});
	});
});
