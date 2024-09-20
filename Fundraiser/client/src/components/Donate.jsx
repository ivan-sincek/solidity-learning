import React, { Component } from "react";
import Web3 from "web3";
import Fundraiser from "../contracts/Fundraiser.json";
import { format } from "date-fns";

// NOTE: Managing state as in a class, not as in a functional component.
export default class Donate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			amount         : "",
			amountMessage  : "",
			gasPrice       : "",
			gasPriceMessage: "",
			globalMessage  : "",
			globalError    : false,
			web3           : null,
			id             : null,
			contract       : null,
			accounts       : null,
			history        : null,
			raised         : 0,
			donated        : 0
		};
		this.donate = this.donate.bind(this);
	}
	async componentDidMount() {
		try {
			let _web3     = new Web3(Web3.givenProvider);
			let _id       = await _web3.eth.net.getId();
			let _contract = new _web3.eth.Contract(Fundraiser.abi, Fundraiser.networks[_id].address);
			let _accounts = await _web3.eth.getAccounts(); // await window.ethereum.enable();
			this.setState({
				web3    : _web3,
				id      : _id,
				contract: _contract,
				accounts: _accounts,
				history : await _contract.methods.myDonations().call({ from: _accounts[0] }),
				raised  : _web3.utils.fromWei(await _contract.methods.raised().call(), "ether"),
				donated : _web3.utils.fromWei(await _contract.methods.myRaised().call({ from: _accounts[0] }), "ether")
			});
		} catch (error) {
			this.setState({
				globalMessage: error,
				globalError  : false
			});
		}
	}
	async donate(event) {
		event.preventDefault();
		let _amountMessage   = "";
		let _gasPriceMessage = "";
		let _globalMessage   = "";
		if (this.state.globalError) {
			_globalMessage = "Web3.0 not initialized";
		} else {
			let error = false;
			if (this.state.amount.length < 1) {
				error = true;
				_amountMessage = "Amount is required";
			} else if (this.state.amount <= 0) {
				error = true;
				_amountMessage = "Amount must be greater than zero";
			}
			if (this.state.gasPrice.length > 0 && this.state.gasPrice <= 0) {
				error = true;
				_gasPriceMessage = "Gas price must be greater than zero";
			}
			if (!error) {
				let transaction = {
					from: this.state.accounts[0],
					value: this.state.web3.utils.toWei(this.state.amount, "ether")
				};
				if (this.state.gasPrice) {
					transaction["gasPrice"] = this.state.web3.utils.toWei(this.state.gasPrice, "gwei");
				}
				await this.state.contract.methods.donate().send(transaction);
				_globalMessage = "Thank you for your donation";
			}
		}
		this.setState({
			amountMessage  : _amountMessage,
			gasPriceMessage: _gasPriceMessage,
			globalMessage  : _globalMessage
		});
	}
	render() {
		return (
			<div className="donate">
				<div className="layout">
					<header>
						<h1 className="title">GitHub Fundraiser</h1>
						<p>
							Raised (ETH): <span>{this.state.raised}</span>
						</p>
						<p>
							Donated (ETH): <span>{this.state.donated}</span>
						</p>
					</header>
					<form method="POST" onSubmit={this.donate}>
						<div className="label-info">
							<label htmlFor="amount">Amount (ETH)</label>
							<div className="info">
								<input id="amountDropdown" type="checkbox" className="info-checkbox"></input>
								<label htmlFor="amountDropdown" className="info-toogle">
									<img src="./img/info.png" alt="Info"></img>
								</label>
								<ul>
									<li>
										<p>Required</p>
									</li>
									<li>
										<p>Max. 10 characters</p>
									</li>
								</ul>
							</div>
						</div>
						<input name="amount" id="amount" type="text" maxLength="10" spellCheck="false" pattern="^[0-9]+(\.[0-9]+)?$" required="required" autoFocus="autoFocus" onChange={(event) => this.setState({ amount: event.target.value })}></input>
						<p className="error">{this.state.amountMessage}</p>
						<div className="label-info">
							<label htmlFor="gasPrice">Gas Price (GWEI)</label>
							<div className="info">
								<input id="gasPriceDropdown" type="checkbox" className="info-checkbox"></input>
								<label htmlFor="gasPriceDropdown" className="info-toogle">
									<img src="./img/info.png" alt="Info"></img>
								</label>
								<ul>
									<li>
										<p>Optional</p>
									</li>
									<li>
										<p>Max. 10 characters</p>
									</li>
								</ul>
							</div>
						</div>
						<input name="gasPrice" id="gasPrice" type="text" maxLength="10" spellCheck="false" pattern="^[0-9]+(\.[0-9]+)?$" onChange={(event) => this.setState({ gasPrice: event.target.value })}></input>
						<p className="error">{this.state.gasPriceMessage}</p>
						<input type="submit" value="Donate"></input>
						<p className="error">{this.state.globalMessage}</p>
					</form>
				</div>
				<h2 className="history">Transaction History</h2>
				<div className="table">
					<table>
						<thead>
							<tr>
								<th>Amount (ETH)</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{this.state.history &&
								this.state.history.map((transaction, index) => {
									return (
										<tr key={index}>
											<td>{this.state.web3.utils.fromWei(transaction.amount, "ether")}</td>
											<td>{format(new Date(transaction.timestamp * 1000), "yyyy/MM/dd HH:mm")}</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
