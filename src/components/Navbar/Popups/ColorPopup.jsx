import React from 'react';

import $ from 'jquery';

import Dropdown from '../../Items/Dropdown';

import { RgbaColorPicker } from "react-colorful";

import { getDefaultTheme, getTheme, getAllDefaultThemes, getAllUserThemes } from '../../../functions/getTheme';
import { hyphenateColorArray, objectToArray } from '../../../functions/helpers';
import { getCurrentlySetColor } from '../../../functions/getCurrentlySetColor';
import { updateGameTheme } from '../../../functions/updateGameTheme';

import '../../styles/popups.css';
import '../../styles/popups/colorPopup.css';
import '../../styles/items/dropdown.css';
import '../../styles/items/buttons.css';


const themeKeys = [
  "game-bg-color",
  "navbar-bg-color",
  "menu-bg-color",
  "hamburger-open-bg-color",
  "text-color",
  "keyboard-text-color",
  "board-text-color",
  "keyboard-letter-background",
  "letter-selected-row-bg-color",
  "letter-bg-color",
  "letter-color-glow",
  "letter-correct-spot-bg-color",
  "letter-bg-in-word-color",
  "letter-not-in-word-text-color",
  "not-in-dictionary-bg-color"
];


class ColorPopUp extends React.Component {

  constructor(props)
  {
    super(props);

    this.state = {
      // Save the original color values
      originalColorValues: {
        gamebgcolor : "",
        navbarbgcolor : "",
        menubgcolor : "",
        hamburgeropenbgcolor : "",
        textcolor : "",
        keyboardtextcolor : "",
        boardtextcolor : "",
        keyboardletterbackground : "",
        letterselectedrowbgcolor : "",
        letterbgcolor : "",
        lettercolorglow : "",
        lettercorrectspotbgcolor : "",
        letterbginwordcolor : "",
        letternotinwordtextcolor : "",
        notindictionarybgcolor : ""
      },
      originalThemeName: "",

      // Set the variables that will hold color and name changes
      colorValuesToSave: [],
      themeNameToSave: "",

      defaultThemes: <></>,
      customThemes: <></>,

      //selectedTheme: this.setSelectedTheme(),
      selectedThemeName: "",
      selectedTheme: <></>,
      //savedThemeName: require('../../../files/user-settings.json')["previousTheme"],
      /*
      apiResponse: "",
      themeToSave: this.getCurrentThemeValues(),

      tileCorrectSpotColorValue: getCurrentlySetColor("letter-correct-spot-bg-color"),
      tileWrongSpotColorValue: getCurrentlySetColor("letter-bg-in-word-color"),
      tileIncorrectWordColorValue: getCurrentlySetColor("not-in-dictionary-bg-color"),

      layoutBackgroundColorValue: getCurrentlySetColor("game-bg-color"),
      layoutNavbarBackgroundColorValue: getCurrentlySetColor("navbar-bg-color"),
      layoutMenuColorValue: getCurrentlySetColor("menu-bg-color"),
      layoutHamburgerBackgroundColorValue: getCurrentlySetColor("hamburger-open-bg-color"),

      textRegColorValue: getCurrentlySetColor("text-color"),
      //layoutHamburgerBackgroundColorValue: getCurrentlySetColor("keyboard-text-color"),
      */
    }

    //this.updateTheme = this.updateTheme.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /*
   * Update Colors after component has been rendered
   */
   componentDidMount = async () =>{
     /*
     var userSettings = require('../../../files/user-settings.json');
     var selectedThemeName = userSettings["selectedTheme"];

     this.updateTheme(selectedThemeName);
     */

     // Gets selected theme name and sets default value in dropdown
     this.getSelectedThemeName();


     // Gets themes and populates 'select a theme' dropdown
     this.themeDropdownBuilder();


     // Save a list of the names of every default theme
     var allDefaultThemesArr = await getAllDefaultThemes();
     var tempDefaultThemeNames = [];
     for( var theme in allDefaultThemesArr)
     {
       let themeName = allDefaultThemesArr[theme]['themeName'];
       console.log("Theme : " + themeName);
       tempDefaultThemeNames.push(themeName);
     }
     this.setState({defaultThemeNames: tempDefaultThemeNames});



     // Save a list of the names of every user theme
     var allUserThemesArr = await getAllUserThemes();
     var tempCustomThemeNames = [];
     for( var theme in allUserThemesArr)
     {
       let themeName = allUserThemesArr[theme]['themeName'];
       console.log("Custom Theme : " + themeName);
       tempCustomThemeNames.push(themeName);
     }
     this.setState({customThemeNames: tempCustomThemeNames});



     // Get and set original theme's name and color values
     var originalThemeName = await this.getSelectedThemeName();
     this.setState({originalThemeName: originalThemeName});

     var originalColorValues = await getTheme(originalThemeName);
     var originalColorValuesObj = { ...this.state.originalColorValues };
     for( var colorName in originalColorValues )
     {
       // Remove hyphen from colorname
       var newColorName = colorName.replace(/-/g, "");
       originalColorValuesObj[newColorName] = originalColorValues[colorName];
     }
     this.setState({originalColorValues: originalColorValuesObj});


     // Set the theme to save to be this initially as well
     this.setState({colorValuesToSave: originalColorValuesObj});
     this.setState({themeNameToSave: originalThemeName});

     /*
      *  Build the dropdown options that will be used for color dropdowns
      */
    this.buildColorOptions();


     var temp = await getTheme('White');
     for( var color in temp )
     {
       //console.log("colorName: " + color);
       //console.log("color: " + temp[color]);
     }

     /*
     getTheme('Slate (default)')
      .then(res => res.json())
      .then(data => {
          temp = data;

        }
      );
      */
     //console.log(temp);

   }

   componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
  }


  /*
   * Get currently selected theme name and set it as state
   */
  getSelectedThemeName = () => {

    return fetch( process.env.REACT_APP_API_URL + "/getUser?user=" + localStorage.getItem("userId"))
        .then(res => res.json())
        .then(res => {
          this.setState({selectedThemeName: res.currentTheme});
          this.setSelectedTheme(res.currentTheme);
          return res.currentTheme;
        });
  }

  /*
   * Sets the default theme for the theme dropdown
   */
  setSelectedTheme = async (selectedThemeName) => {

    const selectedTheme =  await getTheme(selectedThemeName);

    var colors = selectedTheme;

    var option = <div className="title">{selectedThemeName}</div>;

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



    var res = <div className="item row">{option}<div data-value={selectedThemeName} className="colors-wrap">{colorResults}</div></div>;

    this.setState({selectedTheme: res});

  }

  /*
   * Get the color values in the initially saved theme
   */
  getCurrentThemeValues = async () => {

    // Get the selected theme from the user-settings file
    var userSettings = require('../../../files/user-settings.json');
    var selectedThemeName = userSettings["selectedTheme"];

    var customThemes = userSettings["themes"];
    var defaultThemes = require('../../../files/themes.json');

    // If it's in default theme file
    var result;
    if(defaultThemes[selectedThemeName])
    {
      result = defaultThemes[selectedThemeName];
    }
    // If it's in custom theme file
    if(customThemes[selectedThemeName])
    {
      result = customThemes[selectedThemeName];
    }

    return result;
  }



  /*
   * Build 'select a theme' dropdown
   */
  themeDropdownBuilder = async () => {

    var res = <></>;
    // Fetch default themes and save them
    var allDefaultThemesArr = await getAllDefaultThemes();
    var defaultThemesSelectElements = this.defaultThemeDropdownBuilder(allDefaultThemesArr);

    // Fetch default themes and save them
    var allUserThemesArr = await getAllUserThemes();
    var userThemesSelectElements = this.customThemeDropdownBuilder(allUserThemesArr);

    return res;
  }

  defaultThemeDropdownBuilder = (themes) => {

    var results = [];

    // Go through each theme
    for( var theme in themes)
    {
      let themeName = themes[theme]['themeName'];
      var colors = themes[theme];
      colors = hyphenateColorArray(colors);

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

    this.setState({defaultThemes: results});
  }

  customThemeDropdownBuilder = (customThemes) => {
    var results = [];
    // Add our custom made ones to that list
    // Go through each theme

    for( var theme in customThemes)
    {
      let themeName = customThemes[theme]['themeName'];
      var colors = customThemes[theme];
      colors = hyphenateColorArray(colors);

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

    this.setState({customThemes: results});
  }



  /*
   * Get currently set items
   */

  //getCurrentlySetColor = async (type) =>{

    //console.log(type);

    /*
     * The state that we will be pulling from might not be ready.
     * If it's not, we have to pull from database.
     */
     /*
    if(this.state.colorValuesToSave.length > 0)
    {
      return this.state.colorValuesToSave['buildColorOptions'];
    }
    else
    {

      var originalThemeName = await this.getSelectedThemeName();
      var themeValues = await getTheme(originalThemeName);
      console.log(themeValues);
      console.log(type);
      console.log(themeValues[type]);
      return themeValues[type];

      fetch( process.env.REACT_APP_API_URL + "/getUser?user=" + localStorage.getItem("userId"))
          .then(res => res.json())
          .then(res => {
            var themeName = res.currentTheme

          });

      return "Darn";

    }
    */

    // Get the selected theme from the user-settings file

    /*
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
    */

    //return this.state.colorValuesToSave['buildColorOptions'];
  //}



  /*
   * Update the theme for the page and in the database
   */
  updateTheme = (themeName) => {
    // Update colors on page
    updateGameTheme(themeName);
    this.setState({themeNameToSave: themeName});
    this.setState({selectedThemeName: themeName});
  }

  /*
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
  */


  /*
   * When user selects a letter tile color
   *
   * Executes when color picker changes
   */
  updateLetterTile(color, tileName, stateName)
  {

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

  }


  /*
   * Set the color picker and save/cancel buttons for tile dropdown
   */
  buildColorOptions = (colorValue, tileName, stateName) => {


    // Get default color
    var defaultColorValue;
    var tempcolorValue = getCurrentlySetColor(tileName);

    if(colorValue == undefined)
    {
      return <h1>Darn</h1>;
    }



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

    //var tempChosenColor = this.state.tempChosenColor;
    var tempChosenColor = getCurrentlySetColor(tileName);

    var requestURL;

    var userSettings = this.state.userSettings;

    var customThemes = { ...this.state.customThemeNames };
    var currentTheme = this.state.selectedThemeName;

    /*
     * Update the state that's holding the values we want to save.
     */
    //var themeToUpdate = this.state.themeToSave;
    var colorValuesToSave = { ...this.state.colorValuesToSave };
    var newColorVarName = tileName.replace(/-/g, "");

    colorValuesToSave[newColorVarName] = tempChosenColor;

    this.setState({colorValuesToSave: colorValuesToSave});

    /*
     * Update theme name to save
     */
    if( !this.checkIfCurrentThemeIsCustomTheme() )
    {
      // First, see how many themes with the word 'custom' there already is

      var numOfCustom = 1;
      $.each(customThemes, function(index, value) {
          numOfCustom++;
      });


      console.log("length " + numOfCustom);

      var themeName = "Custom-" + numOfCustom;

      console.log("Theme Name: " + themeName);

      // Set the state so we know what custom theme has been created (so we can save or delete it later)
      this.setState({themeNameToSave: themeName});
      this.setState({selectedThemeName: themeName});


    }


    // Get r, g, b, a values from current chosen color
    //var rgbaArr = tempChosenColor.replaceAll(/\s/g,'').replace('rgba(','').replace(')','').split(',');



    /*
     * If it's not working off of a custom theme, we need to make a new one
     * ( Check to see if current theme exists in user settings )
     */
     /*
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

     console.log('themeName = ' + themeName);
     */

    // Update JSON File
    /*
    fetch("http://localhost:9000/updateUserSettings?r=" + rgbaArr[0] + "&g=" + rgbaArr[1] + "&b=" + rgbaArr[2] +  "&a=" + rgbaArr[3] +  "&colorType=" + tileName + "&currentTheme=" + themeName + "&themeToCopy=" + themeToCopy)
        .then(res => res.text())
        .then(res => console.log("Res : " + res));
    */
  }


  /*
   * When 'cancel' is clicked on tile color select
   */
  handleCancelColorTile(colorVarName, tileName)
  {

    // Grab the color that is saved in the json file and update css
    //var savedColorValue = getCurrentlySetColor(colorVarName);
    var colorValuesToSave = { ...this.state.colorValuesToSave };

    var newColorVarName = colorVarName.replace(/-/g, "");
    var savedColorValue = colorValuesToSave[newColorVarName];

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

      var tileStyle = {
        background: "var(--" + type + ")",
      }

      var result = <div className="layout" style={tileStyle}>{text}</div>

      return result;
    }



  /*
   * Handle API call when the User clicks 'Save'
   */
  handleSave(themeName2)
  {
    let themeName = this.state.themeNameToSave;

    // Save theme name in json
    fetch("http://localhost:9000/updateUserSettings?theme=" + this.state.themeNameToSave + "&saveTheme=true")
        .then(res => res.text())
    this.setState({savedThemeName: themeName});

    // Update saved theme values
    let themeValuesToSave = this.state.themeToSave;
    var tempRgbaArr = [];
    var tempChosenColor = "";
    $.each(themeValuesToSave, (index, value) => {
      console.log("index -> " + index + "; value -> " + value);
      tempRgbaArr = value.replaceAll(/\s/g,'').replace('rgba(','').replace(')','').split(',')

      // Update values
      fetch("http://localhost:9000/updateUserSettings?r=" + tempRgbaArr[0] + "&g=" + tempRgbaArr[1] + "&b=" + tempRgbaArr[2] +  "&a=" + tempRgbaArr[3] +  "&colorType=" + index + "&currentTheme=" + themeName)
          .then(res => res.text())
          .then(res => console.log("Res : " + res));

    });





    // Close pop-up
    this.props.closePopup();
  }


  /*
   * Handle API call when the User clicks 'Cancel'
   */
  handleCancel(themeName)
  {

    // Reset theme
    //this.updateTheme(this.state.savedThemeName);

    // We need to reset the selected theme in the JSON file
    // Update JSON File
    fetch("http://localhost:9000/updateUserSettings?theme=" + this.state.savedThemeName + "&cancel=true")
        .then(res => res.text())


    // Reset selected Theme state
    var selectedTheme = this.setSelectedTheme();
    this.setState({selectedTheme: selectedTheme});
    this.setState({selectedThemeName: this.state.savedThemeName});

    // We need to delete the custom theme created after the user updated color values
    fetch("http://localhost:9000/deleteTheme?theme=")
        .then(res => res.text())

    //window.closePopUp();
    this.closePopup();
  }


  /*
   * Close Popup when 'close' is clicked
   */
  closePopup = () => {

    //window.closePopUp();
    this.props.closePopup();
  }




  /*
   * Helper function to check if we're using a custom theme
   */
  checkIfCurrentThemeIsCustomTheme()
  {
    var customThemes = { ...this.state.customThemeNames };


    for(var themeIndex in customThemes)
    {
      console.log("Test theme : " + customThemes[themeIndex]);

      if(this.state.selectedThemeName == customThemes[themeIndex])
      {
        return true;
      }
    }

    return false;
  }


  render(){

    return(
      <>
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
                    options={this.buildColorOptions(getCurrentlySetColor("letter-correct-spot-bg-color"), "letter-correct-spot-bg-color", "tileCorrectSpotColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("letter-bg-in-word-color"), "letter-bg-in-word-color", "tileWrongSpotColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("not-in-dictionary-bg-color"), "not-in-dictionary-bg-color", "tileIncorrectWordColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("keyboard-letter-background"), "keyboard-letter-background", "layoutKeysBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("keyboard-text-color"), "keyboard-text-color", "layoutHamburgerBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("game-bg-color"), "game-bg-color", "layoutBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("navbar-bg-color"), "navbar-bg-color", "layoutNavbarBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("menu-bg-color"), "menu-bg-color", "layoutMenuColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("hamburger-open-bg-color"), "hamburger-open-bg-color", "layoutHamburgerBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("letter-bg-color"), "letter-bg-color", "layoutLetterColorValue")}
                    optionsHoverEffect="false"
                    default={this.getDefaultColorLayout("letter-bg-color", "Letter Background")}
                    name="letter-bg-select"
                    type="layout"
                    dontUpdateTopItem="true" // Means this component will handle everything
                />
              </div>

              <div className="right-side option center">
                <Dropdown
                    options={this.buildColorOptions(getCurrentlySetColor("letter-color-glow"), "letter-color-glow", "layoutGlowBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("letter-selected-row-bg-color"), "letter-selected-row-bg-color", "layoutNavbarBackgroundColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("board-text-color"), "board-text-color", "textBoardColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("letter-not-in-word-text-color"), "letter-not-in-word-text-color", "layoutNotInWordColorValue")}
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
                    options={this.buildColorOptions(getCurrentlySetColor("text-color"), "text-color", "textRegColorValue")}
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



      </>
    )
  }
}

export default ColorPopUp;
