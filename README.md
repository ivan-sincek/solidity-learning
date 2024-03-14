# Solidity Learning

This repository contains Solidity smart contracts and CTF-like challenges for learning purposes.

Built and tested with [Hardhat](https://hardhat.org), and [Truffle Suite](https://trufflesuite.com) (depricated) on a local test network using [Ganache](https://trufflesuite.com/ganache) (depricated) and on [Sepolia](https://www.infura.io) public test network.

Work in progress... Migrating Ethernaut from Truffle to Hardhat...

## Table of Contents

* [Fundraiser](#fundraiser)
* [Ethernaut](#ethernaut)
* [Metamorphic Malware](#metamorphic-malware)

## Fundraiser

Built and tested with [Truffle Suite](https://trufflesuite.com) (depricated) on a local test network using [Ganache](https://trufflesuite.com/ganache) (depricated) and on [Sepolia](https://www.infura.io) public test network.

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

To run the unit tests on [Sepolia](https://www.infura.io) public test network, inside [\\Fundraiser\\truffle\\example.env](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/example.env) file, specify your [Infura](https://www.infura.io) (Sepolia) API key and [MetaMask](https://metamask.io) wallet mnemonic, then, rename `example.env` to `.env` and run:

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

## Ethernaut

Built and tested with [Hardhat](https://hardhat.org).

From [\\Ethernauth\\hardhat](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/hardhat), run the unit tests:

```fundamental
npm install

npx hardhat compile

npx hardhat test --network localhost --parallel
```

---

Unit tests (Hardhat):

* [\\Ethernaut\\hardhat\\test\\ethernaut.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/hardhat/test/ethernaut.js) (all levels)

\[Depricated\] Unit tests (Truffle):

* [\\Ethernaut\\truffle_depricated\\test\\ethernaut.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/truffle_depricated/test/ethernaut.js) (level 1-20)

## Metamorphic Malware

Built and tested with [Truffle Suite](https://trufflesuite.com) (depricated) on a local test network using [Ganache](https://trufflesuite.com/ganache) (depricated).

Work in progress...

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
