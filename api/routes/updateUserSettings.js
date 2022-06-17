var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {

    const fs = require('fs');
    const fileName = './../src/files/user-settings.json';
    const file = require('../../src/files/user-settings.json');

    var defaultThemes = require('../../src/files/themes.json');


    // Save the new theme name parameter
    if(req.query.theme)
    {
      file.selectedTheme = req.query.theme;
    }

    /*
     * Save the new color value
     *
     * @param colorValue: The color value to save
     * @param colorType : The name of the value to save
     */
    if(req.query.r && req.query.g && req.query.b && req.query.a)
    {
      var colorType = req.query.colorType;

      var colorValue = "rgba(" + req.query.r + "," + req.query.g + "," + req.query.b + "," + req.query.a + ")";


      /*
       * We need to copy all the values of the selected theme into our custom
       * theme and set our selected theme as Custom
       */
      // Set theme as Custom
      file.selectedTheme = "Custom";

      // Get currently selected theme
      var currentTheme = req.query.currentTheme;
      var currentThemeValues;
      if(defaultThemes[currentTheme])
      {
        // Copy current
        currentThemeValues = defaultThemes[currentTheme];
        file.themes.Custom = currentThemeValues;

      }



      file.themes.Custom[colorType] = colorValue;




    }

    console.log("SWEEETTTT");
    console.log(req.query);

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
      //console.log(JSON.stringify(file));
      //console.log('writing to ' + fileName);
      console.log("colorValue: " + req.query.colorvalue);
    });


});

module.exports = router;
