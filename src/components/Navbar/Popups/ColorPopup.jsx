import React from 'react';

import $ from 'jquery';

import Dropdown from '../../Items/Dropdown';

import '../../styles/popups.css';
import '../../styles/items/dropdown.css';
import '../../styles/items/buttons.css';

class ColorPopUp extends React.Component {

  constructor(props)
  {
    super(props);

    this.state = {
      themes: require('../../../files/themes.json'),
      userSettings: require('../../../files/user-settings.json'),
      defaultThemes: this.themeDropdownBuilder(),
      customThemes: this.customThemeDropdownBuilder(),
      selectedTheme: this.setSelectedTheme(),
    }

    this.updateTheme = this.updateTheme.bind(this);
  }

  /*
   * Update Colors after component has been rendered
   */
   componentDidMount()
   {
     var userSettings = require('../../../files/user-settings.json');
     var selectedThemeName = userSettings["selected-theme"];

     this.updateTheme(selectedThemeName);
   }


  setSelectedTheme()
  {

    // Get the selected theme from the user-settings file
    var userSettings = require('../../../files/user-settings.json');
    var selectedThemeName = userSettings["selected-theme"];

    var customThemes = userSettings["themes"];
    var defaultThemes = require('../../../files/themes.json');

    var selectedTheme = [];
    // If it's in default theme file
    if(defaultThemes[selectedThemeName])
    {
      selectedTheme = defaultThemes[selectedThemeName];
    }
    // If it's in custom theme file
    if(customThemes[selectedThemeName])
    {
      selectedTheme = customThemes[selectedThemeName];
    }

    var colors = selectedTheme;

    var option = <div key={colorValue} className="title">{selectedThemeName}</div>;

    // Go through each color in theme
    var colorResults = [];
    var j = 0;
    for( var colorName in colors )
    {
      var colorValue = colors[colorName];

      var boxStyle = {
        background: colorValue,
      }

      var key = selectedThemeName + "-" + j.toString();
      colorResults.push(<div key={key} className="color-box" style={boxStyle}></div>);
      j++;
    }



    return <>{option}<div data-value={selectedThemeName} className="colors-wrap">{colorResults}</div></>;

  }

  /*
   * Set default Themes
   */
  themeDropdownBuilder()
  {
    var results = [];
    var themes = require('../../../files/themes.json');

    // Get the selected theme from the user-settings file
    var userSettings = require('../../../files/user-settings.json');
    var selectedThemeName = userSettings["selected-theme"];

    // Go through each theme
    for( var themeName in themes)
    {
      var colors = themes[themeName];

      var option = <div key={colorValue} className="title">{themeName}</div>;

      // Go through each color in theme
      var colorResults = [];
      var j = 0;
      for( var colorName in colors )
      {
        var colorValue = colors[colorName];

        var boxStyle = {
          background: colorValue,
        }

        var key = themeName + "-" + j.toString();
        colorResults.push(<div key={key} className="color-box" style={boxStyle}></div>);
        j++;
      }
      results.push(<>{option}<div data-value={themeName} className="colors-wrap">{colorResults}</div></>);

    }


    return results;
  }

  customThemeDropdownBuilder()
  {
    var results = [];
    // Add our custom made ones to that list
    // Go through each theme
    var userSettings = require('../../../files/user-settings.json');
    var customThemes = userSettings["themes"];

    // Get the selected theme from the user-settings file
    var selectedThemeName = userSettings["selected-theme"];

    for( var themeName in customThemes)
    {
      var colors = customThemes[themeName];

      var option = <div key={colorValue} data-value={themeName} className="title">{themeName}</div>;

      // Go through each color in theme
      var colorResults = [];
      var j = 0;
      for( var colorName in colors )
      {
        var colorValue = colors[colorName];

        var boxStyle = {
          background: colorValue,
        }

        var key = themeName + "-" + j.toString();
        colorResults.push(<div key={key} className="color-box" style={boxStyle}></div>);
        j++;
      }
      results.push(<>{option}<div className="colors-wrap">{colorResults}</div></>);

    }

    return results;
  }


  updateTheme(themeName)
  {
    var themeSource;

    var userSettings = require('../../../files/user-settings.json');
    var selectedThemeName = userSettings["selected-theme"];

    var customThemes = userSettings["themes"];
    var defaultThemes = require('../../../files/themes.json');
/*
    // Set source as custom themes if it has the word custom in it
    if(themeName.includes('custom') || themeName.includes('Custom'))
    {
      themeSource = this.state.userSettings["themes"];
    }
    // Set source as prebuilt themes
    else
    {
      themeSource = this.state.themes;
    }
*/
    // If it's in default theme file
    var selectedTheme = [];
    if(defaultThemes[themeName])
    {
      selectedTheme = defaultThemes[themeName];
    }
    // If it's in custom theme file
    if(customThemes[themeName])
    {
      selectedTheme = customThemes[themeName];
    }


    /*
     * Grab Values from the given theme
     */
     var themeColors = selectedTheme;
     for(var key in themeColors)
     {
       var value = themeColors[key];

       // Set the colors from the theme
       key = "--" + key;
       $('#game-master').get(0).style.setProperty(key, value);;
     }

  }



  render(){

    return(
      <div className="pop-up-wrap open" data-name="color">
        <div className="content-wrap">
          <h1>Edit Colors</h1>
          <div className="row">
            <div className="title">Theme:</div>
            <div className="right-side option">
              <Dropdown options={this.state.defaultThemes} callback={this.updateTheme} default={this.state.selectedTheme} customThemeOptions={this.state.customThemes} />
            </div>
          </div>
          <div className="row center buttons">
            <div className="close-popup button save" onClick={window.closePopUp}>Save</div>
            <div className="close-popup button" onClick={window.closePopUp}>Cancel</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ColorPopUp;
