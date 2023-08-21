const DiamondProxy = artifacts.require("DiamondProxy");

module.exports = function (deployer, network, accounts) {
	deployer.deploy(DiamondProxy);
};
