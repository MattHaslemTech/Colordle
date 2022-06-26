import React from 'react';

import $ from 'jquery';

import ColorPopUp from './Popups/ColorPopup';
import ThemesPopUp from './Popups/ManageThemes';

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
    var popup = e.target.getAttribute("data-popup");
    $('.pop-up-wrap[data-name="' + popup + '"]').addClass('open');
  }

  closePopup()
  {
    $('.pop-up-wrap.open').removeClass('open');
  }

  render(){
    return(
      <>
        <div id="menu" data-open={this.props.open}>


          <div className="item open-popup" onClick={this.openPopUp} data-popup="color">
            <img className="icon" src={colorWheel} />Change Colors
          </div>
          <div className="item open-popup" onClick={this.openPopUp} data-popup="stats
            ">
            <Stats />
            My Stats
          </div>
          <div className="item open-popup" onClick={this.openPopUp} data-popup="manageThemes">
            <img className="icon" src={colorWheel} />Manage Themes
          </div>

        </div>

        <ColorPopUp />
        <ThemesPopUp />
      </>
    )
  }
}

export default Menu;
