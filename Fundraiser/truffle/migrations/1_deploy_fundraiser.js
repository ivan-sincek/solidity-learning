const Fundraiser = artifacts.require("Fundraiser");

module.exports = function (deployer, network, accounts) {
	// ---------- ACCOUNTS
	const custodian   = accounts[0]; // initial custodian (owner)
	const beneficiary = accounts[1]; // initial beneficiary
	// ---------- FUNDRAISER
	const name        = "GitHub Fundraiser";
	const description = "If you found something useful on my GitHub profile, feel free to fund me in order to create even more stuff.";
	const website     = "https://github.com/ivan-sincek";
	const thumbnail   = "https://avatars.githubusercontent.com/u/35937483";

	deployer.deploy(Fundraiser, custodian, beneficiary, name, description, website, thumbnail);
};
