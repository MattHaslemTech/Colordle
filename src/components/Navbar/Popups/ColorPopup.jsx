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
    }

    this.updateTheme = this.updateTheme.bind(this);
  }

  themeDropdownBuilder()
  {
    var results = [];
    var themes = this.state.themes;


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
    var customThemes = this.state.userSettings["themes"];

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

    /*
     * Grab Values from the given theme
     */
     var themeColors = themeSource[themeName];
     for(var key in themeColors)
     {
       var value = themeColors[key];

       // Set the colors from the theme
       key = "--" + key;
       $('#game-master').get(0).style.setProperty(key, value);;
     }

  }

  render(){

    // Get a list of themes to toss in the dropdown
    var themeOptions = this.themeDropdownBuilder();

    // Get a list of cutom themes to toss in the dropdown
    var customThemeOptions = this.customThemeDropdownBuilder();

    return(
      <div className="pop-up-wrap open" data-name="color">
        <div className="content-wrap">
          <h1>Edit Colors</h1>
          <div className="row">
            <div className="title">Theme:</div>
            <div className="right-side option">
              <Dropdown options={themeOptions} callback={this.updateTheme} customThemeOptions={customThemeOptions} />
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
