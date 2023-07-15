# Solidity Learning

Solidity smart contracts for learning purposes.

Built and tested with [Truffle Suite](https://trufflesuite.com) on [Sepolia](https://www.infura.io) test network.

Work in progress...

## How to Run

Download the project:

```fundamental
git clone https://github.com/ivan-sincek/solidity-learning && cd Fundraiser
```

Before compiling, deploying, and interacting with the smart contracts, specify your [Infura](https://www.infura.io) (Sepolia) API key and [MetaMask](https://metamask.io/) wallet mnemonic inside [\\Fundraiser\\truffle\\.env](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/.env).

From [\\Fundraiser\\truffle\\](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle), install the required dependencies, then, compile and deploy smart contracts:

```fundamental
npm install

truffle migrate --network sepolia
```

From [\\Fundraiser\\client\\](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/client), install the required dependencies, then, run a local web server to interact with the smart contracts:

```fundamental
npm install

npm start
```

Finally, navigate to `http://127.0.0.1:8000` with your preferred web browser.

## Source Code

Smart contracts:

* [\\Fundraiser\\truffle\\contracts\\Fundraiser.sol](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/contracts/Fundraiser.sol)

Unit Tests:

* [\\Fundraiser\\truffle\\test\\fundraiser.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/test/fundraiser.js)

Migrations:

* [\\Fundraiser\\truffle\\migrations\\1_deploy_fundraiser.js](https://github.com/ivan-sincek/solidity-learning/blob/main/Fundraiser/truffle/migrations/1_deploy_fundraiser.js)

## Images

<p align="center"><img src="https://github.com/ivan-sincek/solidity-learning/blob/main/img/github_fundraiser.jpg" alt="GitHub Fundraiser"></p>

<p align="center">Figure 1 - GitHub Fundraiser</p>
