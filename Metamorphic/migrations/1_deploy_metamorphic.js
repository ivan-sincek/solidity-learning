const Creator = artifacts.require("Creator");

module.exports = function (deployer, network, accounts) {
	const hacker = accounts[1];

	deployer.deploy(Creator, { from: hacker });
};
