import React from 'react';

import $ from 'jquery';

import '../styles/navbar.css';

import Hamburger from './icons/Hamburger';
import Menu from './Menu';

class Navbar extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      menuOpen: "false",
    };
    this.openMenu = this.openMenu.bind(this);
  }

  openMenu()
  {

    var menuOpen = this.state.menuOpen;

    // If we're closing the menu
    if(menuOpen == "true")
    {
      this.setState({menuOpen: "false"});

      // Show hidden items
      $('#navbar > *:hidden').each(function(){
        $(this).show();
      });

    }
    else
    {
      this.setState({menuOpen: "true"});

      // Hide items
      //$('#navbar > *:not(#hamburger-icon):not(.right-buttons-wrap)').hide();
    }
  }

  render()
  {
    return(
      <div className="navbar-menu-wrap">
        <div id="navbar" data-menu-open={this.state.menuOpen}>
          <div className="left-buttons-wrap">
          </div>
          <div className="title-wrap">
            <div className="title">Colordle</div>
          </div>
          <div className="right-buttons-wrap">
            <Hamburger onClick={this.openMenu} open={this.state.menuOpen} />
          </div>
        </div>
        <Menu open={this.state.menuOpen} />
      </div>
    )
  }
}

export default Navbar;
