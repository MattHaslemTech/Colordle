import React from 'react';

import $ from 'jquery';

import '../styles/items/loading-screen.css';

class LoadingScreen extends React.Component {

  render(){
    return(
      <div className="loading-screen-wrap">
        <div className="loader-wrap">
          <span className="loader"></span>
        </div>
      </div>
    )
  }
}


export default LoadingScreen;
