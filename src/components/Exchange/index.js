// @flow

import React, { Component } from "react";

// import all the config values
import { PROXY_URL, COINS_URL, RATE_URL, KEY, USER_IP } from '../../config.js';

// import all the necessary components from material ui
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

// import all the necessary subcomponents
import Loader from '../Loader';
import InputBox from '../InputBox';

// importing the style from the external css file
import "./exchange.css";

// import all the necessary images
import IconSelected from '../../images/tick_selected.png';
import IconUnSelected from '../../images/tick.png';

// declaring the type of states and props used
type Props = {};
type State = {
  cryptoCurrencyList: Array<Object>,
  dataInProgress: boolean,
  exchangeInProgress: boolean,
  showDepositCurrency: boolean,
  showDestinationCurrency: boolean,
  isPolicyChecked: boolean,
  isChecked: boolean,
  depositValue: number,
  destinationValue: number,
  rotateAngle: number,
  errorMessage: string,
  exchangeData: Object,
  depositCoin: Object,
  destinationCoin: Object,
};

// customising the components from imported material-ui
const PurpleSwitch = withStyles({
  switchBase: {
    color: 'default',
    '&$checked': {
      color: '#736df8 !important',
    },
    '&$checked + $track': {
      backgroundColor: '#736df8 !important',
    },
  },
  checked: {},
  track: {},
})(Switch);
const CustomTextField = withStyles({
  root: {
    color: '#fff',
    '& label.Mui-focused': {
      color: '#fff',
    },
    '& label': {
      color: '#fff',
    },
    '& .MuiInput-underline': {
      borderBottomColor: '#fff !important',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#fff',
      },
      '&:hover fieldset': {
        borderColor: '#fff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
    },
  },
})(TextField);

class Exchange extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cryptoCurrencyList: [],
      dataInProgress: true,
      exchangeInProgress: false,
      showDepositCurrency: false,
      showDestinationCurrency: false,
      isPolicyChecked: true,
      isChecked: false,
      depositValue: 0,
      destinationValue: 0,
      rotateAngle: 0,
      errorMessage: '',
      exchangeData: {},
      depositCoin: {},
      destinationCoin: {},
    };

    //  binding all the necessary functions to perform state operations
    (this: any).onInputChange = this.onInputChange.bind(this);
    (this: any).depositValueChange = this.depositValueChange.bind(this);
    (this: any).handleCheck = this.handleCheck.bind(this);
    (this: any).togglePolicy = this.togglePolicy.bind(this);
    (this: any).selectCryptoCurrency = this.selectCryptoCurrency.bind(this);
    (this: any).onClickExchangeCoins = this.onClickExchangeCoins.bind(this);
  }

  componentDidMount() {
    // create an API call to fetch all the crypto currency types of data and its information
    // set in pprogress state to show a loader while fetching the data
    // setting the starting values as deposit and destination values
    fetch(PROXY_URL + COINS_URL, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'x-user-ip': USER_IP,
      },
      })
      .then(response => response.json())
      .then(data_list => this.setState(prevState=>({
        cryptoCurrencyList: data_list.data.sort(currency=> currency.isActive),
        depositCoin: data_list.data.sort(currency=> currency.isActive)[0],
        destinationCoin: data_list.data.sort(currency=> currency.isActive)[1],
        dataInProgress: false,
        }))
      ).catch((error) => {
        this.setState(prevState=>({
          dataInProgress: false,
          }))
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // calculating the data for the destination value only on change of exchange type and exchange value
    // setting the error message if it dosen't fit the criteria
    if(this.state.exchangeData &&
      (((this.state.exchangeData.limitMaxDepositCoin || 0) !== (prevState.exchangeData.limitMaxDepositCoin || 0)) ||
      ((this.state.exchangeData.limitMaxDestinationCoin || 0) !== (prevState.exchangeData.limitMaxDestinationCoin || 0)) ||
      (this.state.depositValue !== (prevState.depositValue|| 0)))) {
          let tempDestinationValue = 1;
          let tempDepositValue = this.state.depositValue || 0;
          let tempRate = this.state.exchangeData.rate || 0;
          let tempMinerFee = this.state.exchangeData.minerFee || 0;
          tempDestinationValue = ((tempDepositValue * tempRate) - tempMinerFee) || 0;
          tempDestinationValue = tempDestinationValue < 0 ? 0 : tempDestinationValue;
          this.setState(prevState=>({
            destinationValue: tempDestinationValue ? tempDestinationValue.toFixed(4) : tempDestinationValue,
          }));
          if(this.state.exchangeData.limitMinDepositCoin > this.state.depositValue) {
            this.setState(prevState=>({
              errorMessage: `Minimum amount for conversion is ${this.state.exchangeData.limitMinDepositCoin} ${this.state.depositCoin.symbol}`
            }));
          }
      }
      // stopping the loader once all the data has been assigned
      if(this.state.destinationValue !== prevState.destinationValue) {
        this.setState(prevState=>({
          exchangeInProgress: false,
        }));
      }
      // calling the rates api once there is a chnage in deposit or destination value
      if(this.state.depositCoin.symbol !== (prevState.depositCoin.symbol || '') || this.state.destinationCoin.symbol !== (prevState.destinationCoin.symbol || '')) {
        this.depositValueChange()
      }
  }

  // calling therates api and setting the state for the exchange data
  // setting the error message if it dosen't fit the convert
  depositValueChange() {
    this.setState(prevState=>({
      exchangeInProgress: true,
    }));
    let temp_data_list = {};
    var data = JSON.stringify({
      "depositCoin": this.state.depositCoin.symbol,
      "destinationCoin": this.state.destinationCoin.symbol,
    });
    fetch(PROXY_URL + RATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'x-user-ip': USER_IP,
      },
      body: data,
      json: true,
    })
    .then(response => response.json())
    .then(response => {
      if(response.success !== false) {
        this.setState(prevState=>({
          exchangeData: response.data,
          errorMessage: '',
        }))
      } else {
        this.setState(prevState=>({
          exchangeInProgress: false,
          errorMessage: `Cannot convert from ${this.state.depositCoin.name} to ${this.state.destinationCoin.name}`
        }))
      }
      }).catch((error) => {
      });
  }

  // handling input change for deposit value and destination value
  onInputChange(name, value) {
    this.setState(prevState=>({
      [name]: value,
      }));
  }

  // handling switch change for market and fixed rate (dummy)
  handleCheck() {
    const isChecked = !this.state.isChecked;
    this.setState(prevState=>({
      isChecked,
    }));
  }

  // handling toggle check for terms and policy (dummy)
  togglePolicy() {
    const isPolicyChecked = !this.state.isPolicyChecked;
    this.setState(prevState=>({
      isPolicyChecked,
    }));
  }

  // handling on change for crypto currency type
  selectCryptoCurrency(name, value) {
    this.setState(prevState=>({
      [name]: value,
    }));
  }

  // handling on click for exchanging crypto currency types and animation to rotate icon
  onClickExchangeCoins() {
    const rotateAngle = this.state.rotateAngle + 180;
    let tempDepositCoin = this.state.destinationCoin;
    let tempDestinationCoin = this.state.depositCoin;
    this.setState(prevState =>({
      rotateAngle,
      destinationCoin: tempDestinationCoin,
      depositCoin: tempDepositCoin,
    }))
  }

  render() {
    // showing progress bar when retriving data
    if (this.state.dataInProgress) {
      return(
        <div style={{width: '100%', height: '100%'}}>
          <Loader />
        </div>
      );
    }
    // showing data when retrived the necessary data
    return (
      <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', overflowY: 'scroll'}}>
        <div className="exchange-container">
            <div className="error-section" style={{display: this.state.errorMessage && this.state.errorMessage.length ? 'flex' : 'none'}}>
            {this.state.errorMessage}
            </div>
          <div className="banner-badge">
            Buy Crypto
            <span className="banner-badge-alert">NEW</span>
          </div>
          <div className="toggle-rate-section">
            <div>
              Market Rate
              <div className="discount-icon" />
            </div>
            <div style={{margin: '0px 5px'}}>
              <PurpleSwitch checked={this.state.isChecked} onChange={this.handleCheck} />
              <div className="discount-icon" />
            </div>
            <div>
              <div>Fixed Rate</div>
              <div className="discount-amount">
                <i className="material-icons discount-icon">flash_on</i>
                30% Faster
              </div>
            </div>
          </div>
          <div className="exchange-section">
            <div>
              <div className="input-box-label">Send {this.state.depositCoin.name}</div>
              <InputBox
                name="depositValue"
                type="depositCoin"
                logo={this.state.depositCoin.logoUrl}
                symbol={this.state.depositCoin.symbol}
                value={this.state.depositValue}
                cryptoCurrencyList={this.state.cryptoCurrencyList}
                exchangeInProgress={false}
                depositValueChange={this.depositValueChange}
                onInputChange={this.onInputChange}
                selectCryptoCurrency={this.selectCryptoCurrency}
              />
            </div>
            <div>
              <i className="material-icons exchange-icon" onClick={this.onClickExchangeCoins} style={{transform:`rotate(-${this.state.rotateAngle}deg)`}}>sync</i>
            </div>
            <div>
              <div className="input-box-label">Get {this.state.destinationCoin.name}</div>
              <InputBox
                name="destinationValue"
                type="destinationCoin"
                logo={this.state.destinationCoin.logoUrl}
                symbol={this.state.destinationCoin.symbol}
                value={this.state.destinationValue}
                disabled={true}
                onInputChange={this.onInputChange}
                cryptoCurrencyList={this.state.cryptoCurrencyList}
                exchangeInProgress={this.state.exchangeInProgress}
                selectCryptoCurrency={this.selectCryptoCurrency}
              />
            </div>
          </div>
          <div className="currency-address">
            <i className="material-icons scan-icon">qr_code</i>
            <CustomTextField id="address" label={`Enter ${this.state.destinationCoin.name} Address`} style={{width: 335}} />
          </div>
        </div>
        <div className="data-container">
          <div className="exchange-section">
            <div className="data-deposit-section">
              <div className="input-box-label">You are Sending</div>
              <div style={{display: 'flex', maxWidth: '100%'}}>
                <div className="data-deposit-value">
                  {this.state.depositValue}
                </div>
                <div className="data-deposit-type">
                  {this.state.depositCoin.symbol}
                </div>
              </div>
            </div>
            <div>
              <i className="material-icons transfer-icon">arrow_right_alt</i>
            </div>
            <div className="data-destination-section">
              <div className="input-box-label">You May Receive</div>
              <div style={{display: 'flex', maxWidth: '100%'}}>
                <div className="data-destination-value">
                  {this.state.exchangeInProgress ?
                    '...' :
                    this.state.destinationValue}
                </div>
                <div className="data-destination-type">
                  {this.state.destinationCoin.symbol}
                </div>
              </div>
            </div>
          </div>
          <div className="powered-by">
            Powered by <span style={{fontWeight: 'bolder', color: '#fff'}}>Changenow</span>
          </div>
        </div>
        <div className="submit-section">
          <div className="terms-policy" onClick={this.togglePolicy}>
            <img alt="check" src={this.state.isPolicyChecked ? IconSelected : IconUnSelected} className="terms-icon" />
            <div>
              I agree to the <span style={{fontWeight: 'bolder', color: '#fff'}}>terms</span> & <span style={{fontWeight: 'bolder', color: '#fff'}}>privacy policy</span>
            </div>
          </div>
          <div className="submit-button">
            EXCHANGE
          </div>
        </div>
      </div>
    );
  }
}

export default Exchange;
