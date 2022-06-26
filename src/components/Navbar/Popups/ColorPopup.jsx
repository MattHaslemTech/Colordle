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
      savedThemeName: require('../../../files/user-settings.json')["previousTheme"],
      apiResponse: "",

      tileCorrectSpotColorValue: this.getCurrentlySetColor("letter-correct-spot-bg-color"),
      tileWrongSpotColorValue: this.getCurrentlySetColor("letter-bg-in-word-color"),
      tileIncorrectWordColorValue: this.getCurrentlySetColor("not-in-dictionary-bg-color"),

      layoutBackgroundColorValue: this.getCurrentlySetColor("game-bg-color"),
      layoutNavbarBackgroundColorValue: this.getCurrentlySetColor("navbar-bg-color"),
      layoutMenuColorValue: this.getCurrentlySetColor("menu-bg-color"),
      layoutHamburgerBackgroundColorValue: this.getCurrentlySetColor("hamburger-open-bg-color"),

      textRegColorValue: this.getCurrentlySetColor("text-color"),
      layoutHamburgerBackgroundColorValue: this.getCurrentlySetColor("keyboard-text-color"),

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
    colorPicker.push(<><div className="close-popup button save" onClick={(e) => (this.handleSaveColorTile(tileName))}>Save</div><div className="close-popup button" onClick={(e) => (this.handleCancelColorTile(tileName, stateName))}>Cancel</div></>);

    return colorPicker;
  }


  /*
   * When 'save' is clicked on tile color select
   */
  handleSaveColorTile(tileName)
  {

    console.log("tileName: " + tileName);
    var tempChosenColor = this.state.tempChosenColor;

    var requestURL;

    var userSettings = this.state.userSettings;
    var currentTheme = this.state.selectedThemeName;

    // Get r, g, b, a values from current chosen color
    var rgbaArr = tempChosenColor.replaceAll(/\s/g,'').replace('rgba(','').replace(')','').split(',');

    /*
     * If it's not working off of a custom theme, we need to make a new one
     * ( Check to see if current theme exists in user settings )
     */
     /*
     if( this.checkIfCustomTheme() )
     {
       // We just need to update the current value of the custom theme and get out
       fetch("http://localhost:9000/updateUserSettings?r=" + rgbaArr[0] + "&g=" + rgbaArr[1] + "&b=" + rgbaArr[2] +  "&a=" + rgbaArr[3] +  "&colorType=" + tileName + "&currentTheme=" + this.state.selectedThemeName)
           .then(res => res.text())
           .then(res => console.log("Res : " + res));

       return;
     }
     // If we're working off of a default theme
     else
     {

       // First, see how many themes with the word 'custom' there already is
       var numOfCustom = 0;
       $.each(userSettings["themes"], function(index, value) {

         if(index.toLowerCase().indexOf("custom") >= 0 )
         {
           numOfCustom++;
         }

       });


       // Second, we need to copy the values of the theme to update, update the current value, and pass a custom theme name ("Custom {numOfCustom}")
       // We just need to update the current value of the custom theme and get out
       fetch("http://localhost:9000/updateUserSettings?r=" + rgbaArr[0] + "&g=" + rgbaArr[1] + "&b=" + rgbaArr[2] +  "&a=" + rgbaArr[3] +  "&colorType=" + tileName + "&currentTheme=" + this.state.selectedThemeName)
           .then(res => res.text())
           .then(res => console.log("Res : " + res));

       console.log("numOfCustom: " + numOfCustom);

     }
     */

     // Set the theme that we will be updating
     var themeName = this.state.selectedThemeName;

     // Set the theme that we will be copying values from
     var themeToCopy = "";

     if( !this.checkIfCustomTheme() )
     {
       // First, see how many themes with the word 'custom' there already is
       var numOfCustom = 0;
       $.each(userSettings["themes"], function(index, value) {

         if(index.toLowerCase().indexOf("custom") >= 0 )
         {
           numOfCustom++;
         }

       });

       themeName = "Custom-" + numOfCustom;
       themeToCopy = this.state.selectedThemeName;

       // Set the state so we know what custom theme has been created (so we can delete it later)
       this.setState({createdTheme: themeName});
     }

    // Update JSON File

    fetch("http://localhost:9000/updateUserSettings?r=" + rgbaArr[0] + "&g=" + rgbaArr[1] + "&b=" + rgbaArr[2] +  "&a=" + rgbaArr[3] +  "&colorType=" + tileName + "&currentTheme=" + themeName + "&themeToCopy=" + themeToCopy)
        .then(res => res.text())
        .then(res => console.log("Res : " + res));

  }


  /*
   * When 'cancel' is clicked on tile color select
   */
  handleCancelColorTile(colorVarName, tileName)
  {

    // Grab the color that is saved in the json file and update css
    var savedColorValue = this.getCurrentlySetColor(colorVarName);

    var key = '--' + colorVarName;

    // Update Style
    $('#game-master').get(0).style.setProperty(key, savedColorValue);

  }


  /*
   * Get default tile color item
   *
   * @param type:  the name of the css variable
   */
   getDefaultColorTile(type, letter)
   {
     var themes = require('../../../files/themes.json');
     var userSettings = require('../../../files/user-settings.json');

     var tileStyle = {
       background: "var(--" + type + ")",
     }

     var result = <div className="tile" style={tileStyle}>{letter}</div>

     return result;
   }


   /*
    * Get default layout color item
    *
    * @param type:  the name of the css variable
    */
    getDefaultColorLayout(type, text)
    {
      var themes = require('../../../files/themes.json');
      var userSettings = require('../../../files/user-settings.json');

      var tileStyle = {
        background: "var(--" + type + ")",
      }

      var result = <div className="layout" style={tileStyle}>{text}</div>

      return result;
    }



  /*
   * Handle API call when the User clicks 'Save'
   */
  handleSave(themeName)
  {

    // Update JSON File
    fetch("http://localhost:9000/updateUserSettings?theme=" + this.state.selectedThemeName + "&saveTheme=true")
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

    // We need to reset the selected theme in the JSON file
    // Update JSON File
    fetch("http://localhost:9000/updateUserSettings?theme=" + this.state.savedThemeName + "&cancel=true")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));


    // Reset selected Theme state
    var selectedTheme = this.setSelectedTheme();
    this.setState({selectedTheme: selectedTheme});
    this.setState({selectedThemeName: this.state.savedThemeName});

    // We need to delete the custom theme created after the user updated color values
    fetch("http://localhost:9000/deleteTheme?theme=")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));

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
      <div className="pop-up-wrap" data-name="color">
        <div className="content-wrap">
          <h1>Edit Colors</h1>


          <div className="row">
            <div className="title">Theme:</div>
            <div className="right-side option stretch">
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
              Tiles
              <div className="line"></div>
            </div>

            <div className="row">
              <div className="title center">
                Correct Spot:
              </div>
              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-correct-spot-bg-color"), "letter-correct-spot-bg-color", "tileCorrectSpotColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorTile("letter-correct-spot-bg-color", "Q")}
                    name="correct-letter-select"
                    type="letter"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="Q"
                />
              </div>
            </div>

            <div className="row">
              <div className="title center">Wrong Spot:</div>
              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-bg-in-word-color"), "letter-bg-in-word-color", "tileWrongSpotColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorTile("letter-bg-in-word-color", "W")}
                    name="wrong-letter-select"
                    type="letter"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>
            </div>


            <div className="row">
              <div className="title center">Invalid Word:</div>
              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("not-in-dictionary-bg-color"), "not-in-dictionary-bg-color", "tileIncorrectWordColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorTile("not-in-dictionary-bg-color", "E")}
                    name="wrong-word-select"
                    type="letter"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>
            </div>

          </section>

          <section className="mobile-column">
            <div className="row heading-wrap">
              <div className="line"></div>
                Keyboard
              <div className="line"></div>
            </div>

            <div className="keys-wrap row force-row">
              <div className="key">Q</div>
              <div className="key">W</div>
              <div className="key">E</div>
              <div className="key">R</div>
              <div className="key">T</div>
              <div className="key">Y</div>
            </div>

            <div className="row">

              <div className="left-side option center">
                <div className="title">
                  Background:
                </div>
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("keyboard-letter-background"), "keyboard-letter-background", "layoutKeysBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("keyboard-letter-background", "")}
                    name="key-bg-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>

              <div className="right-side option center">
                <div className="title">
                  Text:
                </div>
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("keyboard-text-color"), "keyboard-text-color", "layoutHamburgerBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("keyboard-text-color", "")}
                    name="keyboard-text-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>

            </div>


          </section>

          <section className="mobile-column">
            <div className="row heading-wrap">
              <div className="line"></div>
              Layout
              <div className="line"></div>
            </div>

            <div className="row">
              <div className="left-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("game-bg-color"), "game-bg-color", "layoutBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("game-bg-color", "Background")}
                    name="background-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>

              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("navbar-bg-color"), "navbar-bg-color", "layoutNavbarBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("navbar-bg-color", "Navbar")}
                    name="navbar-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>
            </div>

            <div className="row">
              <div className="left-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("menu-bg-color"), "menu-bg-color", "layoutMenuColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("menu-bg-color", "Menu")}
                    name="menu-bg-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>

              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("hamburger-open-bg-color"), "hamburger-open-bg-color", "layoutHamburgerBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("hamburger-open-bg-color", "Menu Button")}
                    name="hamburger-bg-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>
            </div>



            <div className="row">
              <div className="left-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-bg-color"), "letter-bg-color", "layoutLetterColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("letter-bg-color", "Letter Background")}
                    name="letter-bg-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                />
              </div>

              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-color-glow"), "letter-color-glow", "layoutGlowBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("letter-color-glow", "Button / Glow")}
                    name="glow-bg-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                />
              </div>
            </div>


            <div className="row">

              <div className="right-side option center">
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-selected-row-bg-color"), "letter-selected-row-bg-color", "layoutNavbarBackgroundColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("letter-selected-row-bg-color", "Current Row Tile Background")}
                    name="current-row-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                />
              </div>
            </div>


          </section>


          <section className="mobile-column">

            <div className="row heading-wrap">
              <div className="line"></div>
                Text:
              <div className="line"></div>
            </div>


            <div className="row">
              <div className="left-side option center">
                <div className="title">
                  Game Board:
                </div>
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("board-text-color"), "board-text-color", "textBoardColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("board-text-color", "")}
                    name="board-text-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>

              <div className="right-side option center">
                <div className="title">
                  Not In Word:
                </div>
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("letter-not-in-word-text-color"), "letter-not-in-word-text-color", "layoutNotInWordColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("letter-not-in-word-text-color", "")}
                    name="not-in-word-text-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                />
              </div>
            </div>

            <div className="row">
              <div className="left-side option center">
                <div className="title">
                  Regular Text:
                </div>
                <Dropdown
                    options={this.getColorOptions(this.getCurrentlySetColor("text-color"), "text-color", "textRegColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("text-color", "")}
                    name="text-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                    tileLetter="W"
                />
              </div>

            </div>


          </section>



          <div className="row center buttons bottom-sticky">
            <div className="close-popup button save" onClick={this.handleSave}>
              Save {this.state.apiResponse}
            </div>
            <div className="close-popup button" onClick={() => {this.handleCancel()}}>
              Cancel
            </div>
          </div>



        </div>
      </div>
    )
  }
}

export default ColorPopUp;
