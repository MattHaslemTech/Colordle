import $ from 'jquery';

/*
 * This function will update all the colors on the page
 *
 * Just import 'updateGameTheme' and pass the themeName as a parameter
 */

export const updateGameTheme = (themeName) => {
  // Check if the theme is a default one
  getDefaultTheme(themeName)
   .then(data => {

     // If the theme exist in default-themes;
     if(Object.keys(data).length > 0)
     {
       setInitialThemeValues(data);
     }

     // If it's not a default theme
     else
     {
       getUserTheme(themeName)
        .then(data2 => {
          setInitialThemeValues(data2);
        });
     }
   });

}

export const setInitialThemeValues = (themeObject) => {

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

  for(var key in themeObject)
  {
    var value = themeObject[key];

    // The key from the SQL table doesn't have hyphens in it, so we have to match it to one that does.
    var keyName;
    for(var index in themeKeys)
    {
      var varName = themeKeys[index].replace(/-/g, "");
      if(varName === key)
      {
        keyName = themeKeys[index];
      }
    }

    // Make sure we only get the color values
    if(keyName === undefined)
    {
      continue;
    }

    keyName = "--" + keyName;
    $('#game-master').get(0).style.setProperty(keyName, value);
  }

}



/*
 * Get data from default theme
 *
 * Used to check if a theme is default or not.
 */
const getDefaultTheme = (themeName) => {
  return fetch(process.env.REACT_APP_API_URL + "/getDefaultThemes?themeName=" + themeName)
                     .then(res => res.json())
                     .then(data => {
                       return data;
                     });

}

const getUserTheme = (themeName) => {
  return fetch(process.env.REACT_APP_API_URL + "/getUserThemes?themeName=" + themeName + "&user=" + localStorage.getItem("userId"))
                     .then(res => res.json())
                     .then(data => {
                       return data;
                     });

}
