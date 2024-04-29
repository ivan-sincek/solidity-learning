const { expect } = require("chai");

describe("Upgradeable Tokens", function () {
	let owner, user     = null;
	const initialSupply = 1000000;
	const amount        = ethers.parseEther("100");

	before(async () => {
		[owner, user] = await ethers.getSigners();
	});

	describe("Transparent Proxy", async () => {
		it("Initialize and Upgrade", async () => {
			const TT1Factory = await ethers.getContractFactory("TokenTransparent1"); // implementation contract
			const TT1Proxy = await upgrades.deployProxy(TT1Factory, [owner.address, initialSupply], {
				initializer: "initialize",
				kind: "transparent"
			});

			const TT1Name = await TT1Proxy.symbol();

			await TT1Proxy.connect(owner).mint(user, amount); // mint some more tokens to the user for testing purposes
			const TT1UserBalance = await TT1Proxy.balanceOf(user);
			const TT1TotalSupply = await TT1Proxy.totalSupply();
			expect(TT1TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TT1UserBalance, "Incorrect total token supply.");

			const TT2Factory = await ethers.getContractFactory("TokenTransparent2"); // implementation contract V2
			const TT2Proxy = await upgrades.upgradeProxy(TT1Proxy.target, TT2Factory); // initialize() is never called, and initializeV2() must be called manually
			expect(TT2Proxy).to.equal(TT1Proxy, "Proxy address has changed.");

			const TT2Name = await TT2Proxy.symbol();

			// not minting more tokens to the user
			const TT2UserBalance = await TT2Proxy.balanceOf(user);
			const TT2TotalSupply = await TT2Proxy.totalSupply();
			expect(TT2TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TT2UserBalance, "Incorrect total token supply.");
			// proxy contract is the one remembering the state

			expect(TT2Name).to.equal(TT1Name, "Incorrect token symbol.");
		});

		it("Initialize, Upgrade, and Initialize V2", async () => {
			const TT1Factory = await ethers.getContractFactory("TokenTransparent1"); // implementation contract
			const TT1Proxy = await upgrades.deployProxy(TT1Factory, [owner.address, initialSupply], {
				initializer: "initialize",
				kind: "transparent"
			});

			const TT1Name = await TT1Proxy.symbol();

			await TT1Proxy.connect(owner).mint(user, amount); // mint some more tokens to the user for testing purposes
			const TT1UserBalance = await TT1Proxy.balanceOf(user);
			const TT1TotalSupply = await TT1Proxy.totalSupply();
			expect(TT1TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TT1UserBalance, "Incorrect total token supply.");

			const TT2Factory = await ethers.getContractFactory("TokenTransparent2"); // implementation contract V2
			const TT2Proxy = await upgrades.upgradeProxy(TT1Proxy.target, TT2Factory); // initialize() is never called, and initializeV2() must be called manually
			await TT2Proxy.initializeV2(owner, initialSupply); // not minting more tokens to the owner
			expect(TT2Proxy).to.equal(TT1Proxy, "Proxy address has changed.");

			const TT2Name = await TT2Proxy.symbol(); // token name and symbol should change

			// not minting more tokens to the user
			const TT2UserBalance = await TT2Proxy.balanceOf(user);
			const TT2TotalSupply = await TT2Proxy.totalSupply();
			expect(TT2TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TT2UserBalance, "Incorrect total token supply."); // total token supply and distrubution should stay unchanged
			// proxy contract is the one remembering the state

			expect(TT2Name).to.not.equal(TT1Name, "Incorrect token symbol.");

			await TT2Proxy.hello();
		});
	});

	describe("UUPS Proxy", async () => {
		it("Initialize and Upgrade", async () => {
			const TU1Factory = await ethers.getContractFactory("TokenUUPS1"); // implementation contract
			const TU1Proxy = await upgrades.deployProxy(TU1Factory, [owner.address, initialSupply], {
				initializer: "initialize",
				kind: "uups"
			});

			const TU1Name = await TU1Proxy.symbol();

			await TU1Proxy.connect(owner).mint(user, amount); // mint some more tokens to the user for testing purposes
			const TU1UserBalance = await TU1Proxy.balanceOf(user);
			const TU1TotalSupply = await TU1Proxy.totalSupply();
			expect(TU1TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TU1UserBalance, "Incorrect total token supply.");

			const TU2Factory = await ethers.getContractFactory("TokenUUPS2"); // implementation contract V2
			const TU2Proxy = await upgrades.upgradeProxy(TU1Proxy.target, TU2Factory); // initialize() is never called, and initializeV2() must be called manually
			expect(TU2Proxy).to.equal(TU1Proxy, "Proxy address has changed.");

			const TU2Name = await TU2Proxy.symbol();

			// not minting more tokens to the user
			const TU2UserBalance = await TU2Proxy.balanceOf(user);
			const TU2TotalSupply = await TU2Proxy.totalSupply();
			expect(TU2TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TU2UserBalance, "Incorrect total token supply.");
			// proxy contract is the one remembering the state

			expect(TU2Name).to.equal(TU1Name, "Incorrect token symbol.");
		});

		it("Initialize, Upgrade, and Initialize V2", async () => {
			const TU1Factory = await ethers.getContractFactory("TokenUUPS1"); // implementation contract
			const TU1Proxy = await upgrades.deployProxy(TU1Factory, [owner.address, initialSupply], {
				initializer: "initialize",
				kind: "uups"
			});

			const TU1Name = await TU1Proxy.symbol();

			await TU1Proxy.connect(owner).mint(user, amount); // mint some more tokens to the user for testing purposes
			const TU1UserBalance = await TU1Proxy.balanceOf(user);
			const TU1TotalSupply = await TU1Proxy.totalSupply();
			expect(TU1TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TU1UserBalance, "Incorrect total token supply.");

			const TU2Factory = await ethers.getContractFactory("TokenUUPS2"); // implementation contract V2
			const TU2Proxy = await upgrades.upgradeProxy(TU1Proxy.target, TU2Factory); // initialize() is never called, and initializeV2() must be called manually
			await TU2Proxy.initializeV2(owner, initialSupply); // not minting more tokens to the owner
			expect(TU2Proxy).to.equal(TU1Proxy, "Proxy address has changed.");

			const TU2Name = await TU2Proxy.symbol(); // token name and symbol should change

			// not minting more tokens to the user
			const TU2UserBalance = await TU2Proxy.balanceOf(user);
			const TU2TotalSupply = await TU2Proxy.totalSupply();
			expect(TU2TotalSupply).to.equal(ethers.parseEther(initialSupply.toString()) + TU2UserBalance, "Incorrect total token supply."); // total token supply and distrubution should stay unchanged
			// proxy contract is the one remembering the state

			expect(TU2Name).to.not.equal(TU1Name, "Incorrect token symbol.");

			await TU2Proxy.hello();
		});
	});
});
