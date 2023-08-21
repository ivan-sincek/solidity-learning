require("dotenv").config();
const { MNEMONIC, PROVIDER } = process.env;

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
	contracts_build_directory: "./abi",
	networks: {
		development: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*"
		},
		sepolia: {
			provider: () => new HDWalletProvider(MNEMONIC, PROVIDER),
			network_id: 11155111,
			gas: 4465030
		}
	},
	compilers: {
		solc: {
			version: "0.8.19"
		}
	}
};
