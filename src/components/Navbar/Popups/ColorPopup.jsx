import React from 'react';

import Dropdown from '../../Items/Dropdown';

import '../../styles/popups.css';
import '../../styles/items/dropdown.css';

class ColorPopUp extends React.Component {

  constructor(props)
  {
    super(props);

    this.state = {
      themes: require('../../../files/themes.json'),
    }
  }

  themeDropdownBuilder()
  {
    var results = [];
    var themes = this.state.themes;


    // Go through each theme
    for( var themeName in themes)
    {
      var colors = themes[themeName];
      console.log("val: " + themeName);

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
      results.push(<>{option}<div className="colors-wrap">{colorResults}</div></>);
    }

    // Add our custom made ones to that list
    // Go through each theme
    results.push(<div className="heading">Custom</div>);
    var customThemes = require('../../../files/custom-themes.json')
    for( var themeName in customThemes)
    {
      var colors = customThemes[themeName];

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
      results.push(<>{option}<div className="colors-wrap">{colorResults}</div></>);
    }
    results.push(themes[0]);

    return results;
  }

  render(){

    // Get a list of themes to toss in the dropdown
    var themeOptions = this.themeDropdownBuilder();

    return(
      <div className="pop-up-wrap">
        <div className="content-wrap">
          <h1>Edit Colors</h1>
          <div className="row">
            <div className="title">Theme:</div>
            <div className="right-side option">
              <Dropdown options={themeOptions} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ColorPopUp;
