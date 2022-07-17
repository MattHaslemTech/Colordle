

/*
 * This function will return an array of the theme's color with a hyphenated key
 *
 * Just import 'updateGameTheme' and pass the themeName as a parameter
 */

export const getTheme = (themeName) => {
  // Check if the theme is a default one
  return getDefaultTheme(themeName)
   .then(data => {

     var res = [];
     // If the theme exist in default-themes;
     if(Object.keys(data).length > 0)
     {
       res = setInitialThemeArr(data);
       return res;
     }

     // If it's not a default theme
     else
     {
       return getUserTheme(themeName)
        .then(data2 => {
          res = setInitialThemeArr(data2);
          return res;
        });
     }

   });

}

const setInitialThemeArr = (themeObject) => {

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

  var res = [];

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

    //keyName = "--" + keyName;
    //$('#game-master').get(0).style.setProperty(keyName, value);

    res[keyName] = value;
  }

  return res;
  console.log(res);

}

/*
 * Get data from default theme
 *
 * Used to check if a theme is default or not.
 */
export const getDefaultTheme = (themeName) => {
  return fetch(process.env.REACT_APP_API_URL + "/getDefaultThemes?themeName=" + themeName)
                     .then(res => res.json())
                     .then(data => {
                       return data;
                     });

}

export const getAllDefaultThemes = (themeName) => {
  return fetch(process.env.REACT_APP_API_URL + "/getDefaultThemes")
                     .then(res => res.json())
                     .then(data => {
                       return data;
                     });

}

export const getUserTheme = (themeName) => {
  return fetch(process.env.REACT_APP_API_URL + "/getUserThemes?themeName=" + themeName + "&user=" + localStorage.getItem("userId"))
                     .then(res => res.json())
                     .then(data => {
                       return data;
                     });

}


export const getAllUserThemes = (themeName) => {
  return fetch(process.env.REACT_APP_API_URL + "/getUserThemes?user=" + localStorage.getItem("userId"))
                     .then(res => res.json())
                     .then(data => {
                       return data;
                     });

}
