import React from 'react';

import $ from 'jquery';

import Dropdown from '../../Items/Dropdown';
import SaveButton from '../../Items/Save';

import { RgbaColorPicker } from "react-colorful";


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

      tileCorrectSpotColorValue: this.getCurrentlySetColor("letter-correct-spot-bg-color"),
      tileWrongSpotColorValue: this.getCurrentlySetColor("letter-bg-in-word-color"),
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

  /*
   * Get currently set items
   */
  getCurrentlySetColor(type)
  {
    // Get the selected theme from the user-settings file
    var userSettings = require('../../../files/user-settings.json');
    var selectedThemeName = userSettings["selectedTheme"];

    var customThemes = userSettings["themes"];
    var defaultThemes = require('../../../files/themes.json');

    // If it's in default theme file
    var result;
    if(defaultThemes[selectedThemeName])
    {
      result = defaultThemes[selectedThemeName][type];
    }
    // If it's in custom theme file
    if(customThemes[selectedThemeName])
    {
      result = customThemes[selectedThemeName][type];
    }

    return result;
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
   *
   * Executes when color picker changes
   */
  updateLetterTile(color, tileName, stateName)
  {

    var usingCustomTheme = this.checkIfCustomTheme();


    // The color values are in an are in an array format. Let's make it a string
    var a = "1";
    if(color['a'])
    {
      a = color['a'];
    }
    var rgbaColor = "rgba(" + color['r'] + ", " + color['g'] + ", " + color['b'] + ", " + a + ")";

    var key = '--' + tileName;

    // Update Style
    $('#game-master').get(0).style.setProperty(key, rgbaColor);

    // Set the temporarily chosen color until we either save or cancel
    this.setState({tempChosenColor: rgbaColor});
  }


  /*
   * Set the color picker and save/cancel buttons for tile dropdown
   */
  getColorOptions(colorValue, tileName, stateName)
  {

    // Get default color
    var defaultColorValue;

    // If this is set as RGBA, we need to convert to an array
    var rgbaColorValue = {};
    if( colorValue.substr(0, 4) == "rgba" )
    {
      var rgbaArr = colorValue.replaceAll(/\s/g,'').replace('rgba(','').replace(')','').split(',');
      rgbaColorValue['r'] = rgbaArr[0];
      rgbaColorValue['g'] = rgbaArr[1];
      rgbaColorValue['b'] = rgbaArr[2];
      rgbaColorValue['a'] = rgbaArr[3];
    }

    // Set color picker to put in dropdown
    var colorPicker = [<RgbaColorPicker color={rgbaColorValue} onChange={(color) => (this.updateLetterTile(color, tileName, stateName))} />];

    // Add the save and cancel buttons
    colorPicker.push(<><div className="close-popup button save" onClick={(e) => (this.handleSaveColorTile(tileName))}>Save</div><div className="close-popup button">Cancel</div></>);

    return colorPicker;
  }


  /*
   * When 'save' is clicked on tile color select
   */
  handleSaveColorTile(tileName)
  {
    var tempChosenColor = this.state.tempChosenColor;

    var requestURL;

    // Get r, g, b, a values from current chosen color
    var rgbaArr = tempChosenColor.replaceAll(/\s/g,'').replace('rgba(','').replace(')','').split(',');


    // Update JSON File
    fetch("http://localhost:9000/updateUserSettings?r=" + rgbaArr[0] + "&g=" + rgbaArr[1] + "&b=" + rgbaArr[2] +  "&a=" + rgbaArr[3] +  "&colorType=" + tileName + "&currentTheme=" + this.state.selectedThemeName)
        .then(res => res.text())
        .then(res => console.log("Res : " + res));

    console.log("tempChosenColor2: " + tempChosenColor);
    console.log("tileName2: " + tileName);
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
                  optionsHoverEffect="true"
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
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-correct-spot-bg-color"), "letter-correct-spot-bg-color", "tileCorrectSpotColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorItem("letter-correct-spot-bg-color")}
                    name="correct-letter-select"
                    type="letter"
                    dontUpdateTopItem="true" // Means this component will handle everything
                />
              </div>
            </div>

            <div className="row">
              <div className="title">Wrong Spot:</div>
              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-bg-in-word-color"), "letter-bg-in-word-color", "tileWrongSpotColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorItem("letter-bg-in-word-color")}
                    name="wrong-letter-select"
                    type="letter"
                    dontUpdateTopItem="true" // Means this component will handle everything
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
