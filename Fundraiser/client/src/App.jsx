import React, { Component } from "react";
import { EthProvider } from "./contexts/EthContext";
import Donate from "./components/Donate";
import Footer from "./components/Footer";
import "../public/css/main.css";

export default class App extends Component {
	render() {
		return (
			<EthProvider>
				<Donate />
				<Footer />
			</EthProvider>
		);
	}
}
