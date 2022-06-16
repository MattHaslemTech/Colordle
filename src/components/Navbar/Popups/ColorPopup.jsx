import React from 'react';

import $ from 'jquery';

import Dropdown from '../../Items/Dropdown';
import SaveButton from '../../Items/Save';

import { HexColorPicker } from "react-colorful";


import '../../styles/popups.css';
import '../../styles/popups/colorPopup.css';
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
      selectedThemeName: "",
      savedThemeName: require('../../../files/user-settings.json')["selectedTheme"],
      apiResponse: "",

      tileCorrectSpotColorValue: "",
    }

    this.updateTheme = this.updateTheme.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /*
   * Update Colors after component has been rendered
   */
   componentDidMount()
   {
     var userSettings = require('../../../files/user-settings.json');
     var selectedThemeName = userSettings["selectedTheme"];

     this.updateTheme(selectedThemeName);
   }

   componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
  }


  setSelectedTheme()
  {

    // Get the selected theme from the user-settings file
    var userSettings = require('../../../files/user-settings.json');
    var selectedThemeName = userSettings["selectedTheme"];

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



    return <div className="item row">{option}<div data-value={selectedThemeName} className="colors-wrap">{colorResults}</div></div>;

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
    var selectedThemeName = userSettings["selectedTheme"];

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
    var selectedThemeName = userSettings["selectedTheme"];

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
    var selectedThemeName = userSettings["selectedTheme"];

    var customThemes = userSettings["themes"];
    var defaultThemes = require('../../../files/themes.json');

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
       $('#game-master').get(0).style.setProperty(key, value);
     }

     // Set the new theme name
     this.setState({selectedThemeName: themeName});

  }



  /*
   * When user selects a letter tile color
   */
  updateLetterTile(color, tileName, stateName)
  {
    /*
     * Need to check if we're using a Custom theme.
     *
     * If we're not, we need to create a custom Themes
     */

    var usingCustomTheme = this.checkIfCustomTheme();

    var key = '--' + tileName;
    $('#game-master').get(0).style.setProperty(key, color);

    // Set the state
    this.setState({stateName: color});
    console.log('sweeee ' + key);
  }


  /*
   * Get color options for Tile dropdowns
   */
  getColorOptions(colorValue, tileName, stateName)
  {

    // Set color picker to put in dropdown
    var colorPicker = [<HexColorPicker color={colorValue} onChange={(color) => (this.updateLetterTile(color, tileName, stateName))} />];

    // Add the save and cancel buttons
    colorPicker.push(<><div className="close-popup button save">Save</div><div className="close-popup button">Cancel</div></>);

    return colorPicker;
  }


  /*
   * Get default tile color item
   *
   * @param type:  the name of the css variable
   */
   getDefaultColorValue(type)
   {
     var themes = require('../../../files/themes.json');
     var userSettings = require('../../../files/user-settings.json');

     var tileStyle = {
       background: "var(--" + type + ")",
     }

     var result = <div className="tile" style={tileStyle}>Q</div>

     return result;
   }


  /*
   * Get default tile color item
   *
   * @param type:  the name of the css variable
   */
   getDefaultColorItem(type)
   {
     var themes = require('../../../files/themes.json');
     var userSettings = require('../../../files/user-settings.json');

     var tileStyle = {
       background: "var(--" + type + ")",
     }

     var result = <div className="tile" style={tileStyle}>Q</div>

     return result;
   }

  /*
   * Handle API call when the User clicks 'Save'
   */
  handleSave(themeName)
  {

    // Update JSON File
    fetch("http://localhost:9000/updateUserSettings?theme=" + this.state.selectedThemeName)
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));

    // Update saved theme
    this.setState({savedThemeName: this.state.selectedThemeName});

    // Close pop-up
    window.closePopUp();
  }


  /*
   * Handle API call when the User clicks 'Cancel'
   */
  handleCancel(themeName)
  {

    // Reset theme
    this.updateTheme(this.state.savedThemeName);

    // Reset selected Theme state
    var selectedTheme = this.setSelectedTheme();
    this.setState({selectedTheme: selectedTheme});
    this.setState({selectedThemeName: this.state.savedThemeName});

    window.closePopUp();
  }



  /*
   * Helper function to check if we're using a custom theme
   */
  checkIfCustomTheme()
  {
    var themes = require('../../../files/themes.json');

    // If it's in default theme file
    if(themes[this.state.selectedThemeName])
    {
      return false;
    }

    return true;
  }

  render(){



    return(
      <div className="pop-up-wrap open" data-name="color">
        <div className="content-wrap">
          <h1>Edit Colors</h1>
          <div className="row">
            <div className="title">Theme:</div>
            <div className="right-side option">
              <Dropdown
                  options={this.state.defaultThemes}
                  callback={this.updateTheme}
                  default={this.state.selectedTheme}
                  name="theme-select"
                  type="theme"
                  customThemeOptions={this.state.customThemes}
              />
            </div>
          </div>

          <section>
            <div className="row heading-wrap">
              <div className="line"></div>
              Letters
              <div className="line"></div>
            </div>

            <div className="row">
              <div className="title">Correct Spot:</div>
              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions("#00ff00", "letter-correct-spot-bg-color", "tileCorrectSpotColorValue")}
                    callback={this.updateTheme}
                    default={this.getDefaultColorItem("letter-correct-spot-bg-color")}
                    name="correct-letter-select"
                    type="letter"
                />
              </div>
            </div>

          </section>



          <div className="row center buttons">
            <div className="close-popup button save" onClick={this.handleSave}>
              Save {this.state.apiResponse}
            </div>
            <div className="close-popup button" onClick={this.handleCancel}>Cancel</div>
          </div>



        </div>
      </div>
    )
  }
}

export default ColorPopUp;
