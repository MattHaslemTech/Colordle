import React from 'react';

import '../styles/menu.css';
import colorWheel from './icons/color-wheel.png';
import Stats from './icons/Stats';

class Menu extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  openPopUp(e) {
    var popup = e.target.getAttribute("data-popup");;
  }

  render(){
    return(
      <div id="menu" data-open={this.props.open}>


        <div className="item open-popup" onClick={this.openPopUp} data-popup="color">
          <img className="icon" src={colorWheel} />Change Colors
        </div>
        <div className="item open-popup">
          <Stats />
          My Stats
        </div>

      </div>
    )
  }
}

export default Menu;
