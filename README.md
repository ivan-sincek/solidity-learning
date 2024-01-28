# Solidity Learning

Solidity smart contracts created for learning purposes.

Built and tested with [Truffle Suite](https://trufflesuite.com) on a local test network using [Ganache](https://trufflesuite.com/ganache) and on [Sepolia](https://www.infura.io) public test network.

Work in progress...

## Table of Contents

* [Instructions](#instructions)
* [Fundraiser](#fundraiser)
* [Ethernaut](#ethernaut)
* [Metamorphic Malware](#metamorphic-malware)

## Instructions

Clone the repository:

```fundamental
git clone https://github.com/ivan-sincek/solidity-learning
```

Change the directory to a desired project:

```fundamental
cd Fundraiser
```

Wherever you see [package.json](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/package.json) file, install the required dependencies by running:

```fundamental
npm install
```

Start a local test network using Ganache. Make sure to change the port number to `8545`.

<p align="center"><img src="https://github.com/ivan-sincek/solidity-learning/blob/main/img/ganache_setup.jpg" alt="Ganache Setup"></p>

<p align="center">Figure 1 - Ganache Setup</p>

Start unit tests a local network by running:

```fundamental
truffle test --network development --show-events
```

---

Wherever you see [.env](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/.env) file, you can specify your [Infura](https://www.infura.io) (Sepolia) API key and [MetaMask](https://metamask.io/) wallet mnemonic inside the file to test on Sepolia public test network.

Start unit tests on Sepolia public test network:

```fundamental
truffle test --network sepolia --show-events
```

## Fundraiser

Smart contracts:

* [\\Fundraiser\\truffle\\contracts\\Fundraiser.sol](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/contracts/Fundraiser.sol)

Unit Tests:

* [\\Fundraiser\\truffle\\test\\fundraiser.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/test/fundraiser.js)

Migrations:

* [\\Fundraiser\\truffle\\migrations\\1_deploy_fundraiser.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/migrations/1_deploy_fundraiser.js)

Client:

* [\\Fundraiser\\client\\src\\components\\Donate.jsx](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/client/src/components/Donate.jsx)

---

<p align="center"><img src="https://github.com/ivan-sincek/solidity-learning/blob/main/img/github_fundraiser.jpg" alt="GitHub Fundraiser"></p>

<p align="center">Figure 2 - GitHub Fundraiser</p>

## Ethernaut

Solutions:

* [\\Ethernaut\\test\\ethernaut.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/test/ethernaut.js)

## Metamorphic Malware

Work in progress...

Smart contracts:

* [\\Metamorphic\\contracts\\MetamorphicBasic.sol](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/contracts/MetamorphicBasic.sol)

Unit Tests:

* [\\Metamorphic\\test\\metamorphic.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/test/metamorphic.js)

Migrations:

* [\\Metamorphic\\migrations\\1_deploy_metamorphic.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/migrations/1_deploy_metamorphic.js)
