# Solidity Learning

Solidity smart contracts created for learning purposes.

Built and tested with [Truffle Suite](https://trufflesuite.com) on [Sepolia](https://www.infura.io) test network and on local network using [Ganache](https://trufflesuite.com/ganache).

Work in progress...

## Table of Contents

* [Instructions](#instructions)
* [Fundraiser](#fundraiser)
* [Ethernaut](#ethernaut)
* [Metamorphic Malware](#metamorphic-malware)

## Instructions

Download the repository:

```fundamental
git clone https://github.com/ivan-sincek/solidity-learning
```

Change the directory to desired project:

```fundamental
cd Fundraiser
```

Wherever you see [package.json](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/package.json) file, install the required dependencies by running:

```fundamental
npm install
```

Wherever you see [.env](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/.env) file, specify your [Infura](https://www.infura.io) (Sepolia) API key and [MetaMask](https://metamask.io/) wallet mnemonic inside the file.

Start unit tests by running:

```fundamental
truffle test --network sepolia --show-events

truffle test --network development --show-events
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

<p align="center">Figure 1 - GitHub Fundraiser</p>

## Ethernaut

Solutions:

* [\\Ethernaut\\test\\ethernaut.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Ethernaut/test/ethernaut.js)

## Metamorphic Malware

Still working on it...

Smart contracts:

* [\\Metamorphic\\contracts\\MetamorphicBasic.sol](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/contracts/MetamorphicBasic.sol)

Unit Tests:

* [\\Metamorphic\\test\\metamorphic.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/test/metamorphic.js)

Migrations:

* [\\Metamorphic\\migrations\\1_deploy_metamorphic.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Metamorphic/migrations/1_deploy_metamorphic.js)
