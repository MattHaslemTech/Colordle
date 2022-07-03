import React from 'react';

import $ from 'jquery';

import Dropdown from '../../Items/Dropdown';
import SaveButton from '../../Items/Save';

import '../../styles/items/color-box.css';
import '../../styles/popups/manageThemes.css';


class ThemesPopUp extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      themes: this.generateThemesList(),
      currentThemeName: this.getCurrentTheme()
    }

    this.deleteItem = this.deleteItem.bind(this);
  }

  /*
   * Get the name of the currently saved theme
   */
  getCurrentTheme()
  {
    var userSettings = require('../../../files/user-settings.json');
    return userSettings['selectedTheme'];
  }

  /*
   * Generate all the custom theme items that will show in the popup
   */
  generateThemesList()
  {
    var userSettings = require('../../../files/user-settings.json');
    var customThemes = userSettings["themes"];

    var results = [];
    if(customThemes)
    {
      for( let themeName in customThemes)
      {
        // Check if this theme is our current theme
        let isCurrentTheme = false;
        if(themeName == this.getCurrentTheme())
        {
          isCurrentTheme = true;
        }


        var titleDiv = <div className="title">{themeName}</div>;

        // Set the delete and use button
        var deleteItem = <div className="delete button" data-disabled={isCurrentTheme} data-themename={themeName} onClick={() => {this.deleteItem(themeName, isCurrentTheme) } }>Delete</div>

        var changeThemeButton = <div className="change-theme button color" data-disabled={isCurrentTheme} onClick={() => {this.changeTheme(themeName, isCurrentTheme)}}>Use</div>


        // Create the color box to go with the theme
        var themeArr = customThemes[themeName];
        var colorBox = [];
        var i = 0;
        for( var colorName in themeArr )
        {
            var colorValue = themeArr[colorName];

            var boxStyle = {
              background: colorValue,
            }

            var key = themeName + "-manage-theme-item" + i.toString();
            colorBox.push(<div key={key} className="color-box" style={boxStyle}></div>);
            i++;

        };

        results.push(<div className="item row" key={themeName}>{titleDiv}<div className="colors-wrap">{colorBox}</div><div className="buttons-wrap">{changeThemeButton}{deleteItem}</div> </div>);
      }

    }
    else
    {
      results.push(<h3>You have no saved themes!</h3>);
    }

    return results;
  }


  /*
   * Delete the theme when the delete button is clicked
   */
   deleteItem(themeName, isCurrentTheme)
   {

     // If it's the current theme, don't do anything
     if(isCurrentTheme)
     {
       return;
     }
     else
     {
       // Open the loader
       this.handleLoader('open');

       fetch("http://localhost:9000/deleteTheme?theme=" + themeName)
           .then(res => res.text())
           .then(res => this.handleLoader('close'));
     }

   }


  /*
   * Change theme if the 'use' button is clicked
   */
  changeTheme(themeName, isCurrentTheme)
  {
    // If it's the current theme, don't do anything
    if(isCurrentTheme)
    {
      return;
    }
    else
    {
      // Open the loader
      this.handleLoader('open');

      // Update JSON File
      fetch("http://localhost:9000/updateUserSettings?theme=" + themeName + "&saveTheme=true")
          .then(res => this.handleLoader('close'));
    }
  }


  /*
   * Close Popup when 'close' is clicked
   */
  handleCancel = () => {

    //window.closePopUp();
    this.props.closePopup();
  }


  /*
   * Show/Hide the loader wrap
   */
  handleLoader(openOrClose)
  {
    if(openOrClose == 'open')
    {
      $('.loading-screen-wrap').addClass('open')
    }
    if(openOrClose == 'close')
    {
      $('.loading-screen-wrap').removeClass('open')
    }

  }


  render(){
    return(
      <>

            <h1>My Themes</h1>

            {this.state.themes}

            <div className="row center buttons bottom-sticky">

              <div className="close-popup button" onClick={this.handleCancel}>
                Close
              </div>

            </div>

      </>
    )
  }
}

export default ThemesPopUp;