# Solidity Learning

This repository contains Solidity smart contract projects and CTF-like challenges for learning purposes.

Built and tested with [Hardhat](https://hardhat.org).

_Some of the old projects were built and tested with now deprecated [Truffle Suite](https://trufflesuite.com) using now deprecated [Ganache](https://trufflesuite.com/ganache) local test network and [Sepolia](https://www.infura.io) public test network._

Useful resources:

| URL | Description |
| --- | --- |
| [weekinethereumnews.com](https://weekinethereumnews.com) | Latest Ethereum blockchain and EVM news and updates. |
| [docs.soliditylang.org](https://docs.soliditylang.org/en/latest) | Official Solidity documentation. |
| [consensys.github.io](https://consensys.github.io/smart-contract-best-practices) | Solidity best coding practices. |
| [solidity-by-example.org](https://solidity-by-example.org) | Solidity smart contract xamples. |
| [docs.openzeppelin.com](https://docs.openzeppelin.com) | Secure Solidity smart contracts. |
| [wizard.openzeppelin.com](https://wizard.openzeppelin.com) | Secure Solidity smart contract wizard. |
| [ethervm.io](https://ethervm.io) | EVM opcodes - Solidity assembly. |
| [hardhat.org](https://hardhat.org/docs) | Offline Solidity IDE. |
| [remix.ethereum.org](https://remix.ethereum.org) | Online Solidity IDE. |
| [infura.io](https://www.infura.io/faucet/sepolia) | Sepolia - Ethereum public test network. |
| [docs.ethers.org](https://docs.ethers.org) | Front-end library to connect with blockchain. |
| [web3js.readthedocs.io](https://web3js.readthedocs.io) | Front-end library to connect with blockchain. |

Work in progress...

## Table of Contents

* [Ethernaut](#ethernaut)
* [Upgradeable Contracts](#upgradeable-contracts)
* [Fundraiser](#fundraiser) (old)
* [Metamorphic Malware](#metamorphic-malware) (old)

## Ethernaut

Web: [ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com)

GitHub: [OpenZeppelin/ethernaut](https://github.com/OpenZeppelin/ethernaut)

Built and tested with [Hardhat](https://hardhat.org). Work in progress...

From [\\Ethernauth\\hardhat](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/hardhat), run the unit tests:

```fundamental
npm install

npx hardhat compile

npx hardhat test --network localhost --parallel
```

---

Unit tests (Hardhat):

* [\\Ethernaut\\hardhat\\test\\ethernaut.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/hardhat/test/ethernaut.js) (1-25)

_\[Deprecated\]_ Unit tests (Truffle):

* [\\Ethernaut\\truffle_suite_deprecated\\test\\ethernaut.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/truffle_suite_deprecated/test/ethernaut.js) (level 1-20)

## Upgradeable Contracts

Built and tested with [Hardhat](https://hardhat.org). Work in progress...

Smart contracts:

* [\\UpgradeableContracts\\contracts\\](https://github.com/ivan-sincek/solidity-learning/tree/main/UpgradeableContracts/contracts)

Unit tests:

* [\\UpgradeableContracts\\test\\upgradeable.js](https://github.com/ivan-sincek/solidity-learning/blob/main/UpgradeableContracts/test/upgradeable.js)

Migrations:

* [\\UpgradeableContracts\\scripts\\deploy.js](https://github.com/ivan-sincek/solidity-learning/blob/main/UpgradeableContracts/scripts/deploy.js)

## Fundraiser

__Built and tested with now deprecated [Truffle Suite](https://trufflesuite.com) using now deprecated [Ganache](https://trufflesuite.com/ganache) local test network and [Sepolia](https://www.infura.io) public test network.__

Work in progress... Also, need to migrate to Hardhat.

Install Truffle:

```fundamental
npm install -g truffle
```

Make sure to start a local test network using Ganache on port `8545`.

<p align="center"><img src="https://github.com/ivan-sincek/solidity-learning/blob/main/img/ganache_setup.jpg" alt="Ganache Setup"></p>

<p align="center">Figure 1 - Ganache Setup</p>

---

From [\\Fundraiser\\truffle](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle), run the unit tests:

```fundamental
npm install

truffle compile

truffle test --network development --show-events
```

From [\\Fundraiser\\client](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/client), run the client web application:

```fundamental
npm install

npm start
```

Navigate to the client web application with your preferred web browser.

<p align="center"><img src="https://github.com/ivan-sincek/solidity-learning/blob/main/img/github_fundraiser.jpg" alt="GitHub Fundraiser"></p>

<p align="center">Figure 2 - GitHub Fundraiser</p>

---

To run the unit tests on [Sepolia](https://www.infura.io) public test network, do the following:

\[1\] Specify your [Infura](https://www.infura.io) (Sepolia) API key and [MetaMask](https://metamask.io) wallet mnemonic inside [\\Fundraiser\\truffle\\example.env](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/example.env) file.

\[2\] Rename the file from `example.env` to `.env`.

\[3\] In your MetaMask wallet, [switch](https://moralis.io/how-to-add-the-sepolia-network-to-metamask-full-guide) to the Sepolia public test network.

\[4\] Get some Sepolia ETH from [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia) to your MetaMask wallet.

\[5\] Finally, run:

```fundamental
truffle test --network sepolia --show-events
```

---

Smart contracts:

* [\\Fundraiser\\truffle\\contracts\\Fundraiser.sol](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/contracts/Fundraiser.sol)

Unit tests:

* [\\Fundraiser\\truffle\\test\\fundraiser.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/test/fundraiser.js)

Migrations:

* [\\Fundraiser\\truffle\\migrations\\1_deploy_fundraiser.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/migrations/1_deploy_fundraiser.js)

Client web application:

* [\\Fundraiser\\client\\src\\components\\Donate.jsx](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/client/src/components/Donate.jsx)

## Metamorphic Malware

__Built and tested with now deprecated [Truffle Suite](https://trufflesuite.com) using now deprecated [Ganache](https://trufflesuite.com/ganache) local test network and [Sepolia](https://www.infura.io) public test network.__

Work in progress... Also, need to migrate to Hardhat.

From [\\Metamorphic](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic), run the unit tests:

```fundamental
npm install

truffle compile

truffle test --network development --show-events
```

---

Smart contracts:

* [\\Metamorphic\\contracts\\MetamorphicBasic.sol](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/contracts/MetamorphicBasic.sol)

Unit Tests:

* [\\Metamorphic\\test\\metamorphic.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/test/metamorphic.js)

Migrations:

* [\\Metamorphic\\migrations\\1_deploy_metamorphic.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/migrations/1_deploy_metamorphic.js)
