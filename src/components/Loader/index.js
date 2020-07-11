// @flow
import React from "react";

import "./loader.css";

const Loader = () => {
  return (
    <div className="gt-cbot-loader">
      <div className="gt-cbot-loader-holder">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((el, index) => (
          <div key={"gt-cbot-loader-holder" + index} />
        ))}
      </div>
    </div>
  );
};

export default Loader;
