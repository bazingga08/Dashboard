// @flow

import React, { Component } from "react";

// importing the style from the external css file
import "./cryptoitem.css";


// declaring the type of states and props used
type Props = {
  data: {
    symbol: string,
    logoUrl: string,
    name: string,
    selectCryptoCurrency: ()=>null,
  },
};
type State = {};

class CryptoItem extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
    //  binding all the necessary functions to perform state operations
    (this: any).selectCryptoCurrency = this.selectCryptoCurrency.bind(this);
  }

  // handling on Click for the crypto currency row
  selectCryptoCurrency(e) {
    this.props.selectCryptoCurrency(this.props.data)
  }

  render() {
    return (
      <div className="crypto-currency-item" name={this.props.data.symbol} onClick={this.selectCryptoCurrency} >
        <img className="crypto-currency-logo" alt="logo" src={this.props.data.logoUrl} />
        <div className="crypto-currency-symbol" >{this.props.data.symbol}</div>
        <div className="crypto-currency-name" >{this.props.data.name}</div>
      </div>
      );
  }
}

export default CryptoItem;
