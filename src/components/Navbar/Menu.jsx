import React from 'react';

import $ from 'jquery';

import PopUp from './Popups/Popup';
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

    this.state = {
      popupName: "",
      popupOpen: false,
    }

    this.openPopUp = this.openPopUp.bind(this);
  }

  openPopUp(e) {
    //var popup = e.target.getAttribute("data-popup");

    //$('.pop-up-wrap[data-name="' + popup + '"]').addClass('open');
    var popupName = e.target.getAttribute("data-popup");

    this.setState({popupOpen: true, popupName: popupName});

  }

  closePopup()
  {
    $('.pop-up-wrap.open').removeClass('open');

    this.setState({popupOpen: false});
  }

  testdb = async () => {

    //let obj;

    //const res = await fetch(process.env.REACT_APP_API_URL + "/getUserThemes?user=" + localStorage.getItem("userId") + "&themeName=Custom-1&value=game-bg-color")
    const res = await fetch(process.env.REACT_APP_API_URL + "/getUser?user=nice")

    let obj = await res.text();

    console.log("obj : " + obj);

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
          <div className="item" onClick={this.testdb} data-popup="manageThemes">
            <img className="icon" src={colorWheel} />Test
          </div>

        </div>



        <PopUp open={this.state.popupOpen} popupName={this.state.popupName} closePopup={(e) => this.closePopup()} />
      </>
    )
  }
}

export default Menu;
