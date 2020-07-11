// @flow

import React, { Component } from "react";

// import all the necessary subcomponents
import CryptoItem from '../CryptoItem';
import IconProgress from '../../images/text_loader.gif';

// importing the style from the external css file
import "./inputbox.css";


// declaring the type of states and props used
type Props = {
  onInputChange: ()=> null,
  depositValueChange: ()=> null,
  selectCryptoCurrency: ()=> null,
  exchangeInProgress: boolean,
  cryptoCurrencyList: Array<Object>,
  value: string,
  name: string,
  type: string,
  logo: string,
  symbol: string,
};
type State = {
  showDepositCurrency: boolean,
  search: string,
};

class InputBox extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      showDepositCurrency: false,
      search: '',
    };

    //  binding all the necessary functions to perform state operations
    (this: any).onInputChange = this.onInputChange.bind(this);
    (this: any).onClickDepositCurrency = this.onClickDepositCurrency.bind(this);
    (this: any).selectCryptoCurrency = this.selectCryptoCurrency.bind(this);
    (this: any).handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  // handling on change for crypto currency input and search input box
  onInputChange(e) {
    const { name, value } = e.target;
    if (name === 'value' && value) {
      this.props.depositValueChange();
      this.props.onInputChange(this.props.name, value)
    }
    this.setState(prevState=>({
      [name]: value,
    }));
  }

  // handling on click for crypto currency to toggle crypto currency list
  onClickDepositCurrency() {
    const showDepositCurrency = !this.state.showDepositCurrency;

    // adding and removing event listener only on open of the crypto currency list and clearing the search

    if (showDepositCurrency) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState(prevState=>({
      showDepositCurrency,
      search: '',
    }));
  }

  // handling on change for crypto currency value selecting the desired type of currency
  selectCryptoCurrency(value) {
    if(this.state.showDepositCurrency) {
      this.setState(prevState=>({
        showDepositCurrency: false,
      }));
    }
    this.props.selectCryptoCurrency(this.props.type, value);
  }

  // handling on click to close crypto currency list when clicked outside
  handleOutsideClick(e) {
    if(this.state.showDepositCurrency) {
      if(e.target.name !== 'search') {
        this.setState(prevState=>({
          showDepositCurrency: false,
        }));
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    }
  }

  render() {
    let tempCryptoCurrencyList = this.props.cryptoCurrencyList.filter((item) =>
            (item.name && item.name.toLowerCase().search(this.state.search.toLowerCase()) !== -1) ||
            (item.symbol && item.symbol.toLowerCase().search(this.state.search.toLowerCase()) !== -1));
    return (
      <div className="input-container">
        <input
          name="value"
          type="number"
          className="currency-input"
          value={this.props.value}
          disabled={this.props.disabled}
          step="any"
          onChange={this.onInputChange}
        />
        {this.props.exchangeInProgress ?
          <div className="text-loader">
            <img alt="progress" src={IconProgress} />
          </div> :
          null
        }
        <div className="deposit-currency-value" onClick={this.onClickDepositCurrency}>
          <img className="crypto-currency-logo" alt="logo" src={this.props.logo} />
          <div>{this.props.symbol}</div>
          <i className="material-icons" style={{marginLeft: 5}}>keyboard_arrow_down</i>
        </div>
          <div style={{height:this.state.showDepositCurrency ? 300 : 0}} className="crypto-currency-list">
            <div className="search-box">
              <input
                type="text"
                id={"search" + this.props.type}
                autoComplete="off"
                name="search"
                className="currency-search"
                placeholder={`search from ${tempCryptoCurrencyList.length} coins`}
                value={this.state.search}
                step="any"
                onChange={this.onInputChange}
              />
              <i  className="material-icons currency-search-icon">search</i>
              <i  onClick={this.onClickDepositCurrency} className="material-icons currency-clear">close</i>
            </div>
            {tempCryptoCurrencyList && tempCryptoCurrencyList.length ?
              tempCryptoCurrencyList.map((item, index) => (
                  <CryptoItem
                    key={item.name + index}
                    data={item}
                    selectCryptoCurrency={this.selectCryptoCurrency}
                  />
                ))
                :
                <div className="no-search-results">
                  <img alt="not found" src="https://files.coinswitch.co/ui/public/images/cset__not-found.png" />
                  could not find results for {`"${this.state.search}"`}
                </div>
            }
          </div>
      </div>
      );
  }
}

export default InputBox;
