// @flow

import React, { Component } from "react";

// importing the style from the external css file
import "./noResultsFound.css";

// import all the necessary images
import IconInProgress from '../../images/in_progress.gif';

// declaring the type of states and props used
type Props = {};
type State = {};

class NoResultsFound extends Component<Props, State> {
  render() {
    return (
      <div className="no-results-found">
        <img alt="404" src={IconInProgress} style={{width: '100%'}}/>
      </div>
    );
  }
}

export default NoResultsFound;
