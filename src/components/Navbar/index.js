// @flow

import React, { Component } from "react";
import { NavLink } from "react-router-dom";

// importing the style from the external css file
import "./navbar.css";

// import all the necessary images
import IconLogo from '../../images/logo.png';


// declaring the type of states and props used
type Props = {};
type State = {};

class Navbar extends Component<Props, State> {
  render() {
    return (
      <div className="navbar-section">
        <div className="nav-link-section">
          <div className="nav-logo-container">
            <img alt="img" className="nav-logo" src={IconLogo} />
          </div>
          <NavLink
            to="/dashboard/exchange"
            className="nav-link"
            activeClassName="nav-link-active"
          >
            <i className="material-icons nav-link-icon">sync</i>
            Exchange
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className="nav-link"
            activeClassName="nav-link-active"
          >
            <i className="material-icons nav-link-icon">access_time</i>
            My Orders
          </NavLink>
          <NavLink
            to="/dashboard/track"
            className="nav-link"
            activeClassName="nav-link-active"
          >
            <i className="material-icons nav-link-icon">search</i>
            Track Orders
          </NavLink>
          <NavLink
            to="/dashboard/products"
            className="nav-link"
            activeClassName="nav-link-active"
          >
            <i className="material-icons nav-link-icon">shopping_cart</i>
            Products
          </NavLink>
          <NavLink
            to="/dashboard/refer"
            className="nav-link"
            activeClassName="nav-link-active"
          >
            <i className="material-icons nav-link-icon">attach_money</i>
            Refer and Earn $5
          </NavLink>
        </div>
        <div className="nav-link-section">
          <div className="nav-button nav-button-active">
            Login
          </div>
          <div className="nav-button">
            Priority Support
          </div>
          <div className="nav-button">
            Go to Old Website
          </div>
          <div className="nav-button">
            Share your feedback
          </div>
        </div>
      </div>
      );
  }
}

export default Navbar;
