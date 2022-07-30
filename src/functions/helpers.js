export const hyphenateColorArray = (colorArray) => {
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

  for(var key in colorArray)
  {
    var value = colorArray[key];

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


    res[keyName] = value;
  }

  return res;

}


/*
 * Convert and object to an array
 */
export const objectToArray = (obj) => {

  var res = [];

  for(var index in obj)
  {
    res[index] = obj[index];
    console.log("index : " + index);
  }
  console.log("RES : " + res);

  return res;

}
