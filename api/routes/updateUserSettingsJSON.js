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

    // If they clicked 'save' on the popup -> set previousTheme
    if(req.query.saveTheme == "true")
    {
      file.previousTheme = req.query.theme;
    }

    // If they clicked 'cancel' on the popup -> set selectedTheme
    if(req.query.cancel == "true")
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
      // Get currently selected theme ( The one whose value we're going to update )
      var currentTheme = req.query.currentTheme;

      // Get the theme to copy
      var themeToCopy = currentTheme;
      if(req.query.themeToCopy)
      {
        themeToCopy = req.query.themeToCopy;
      }


      var currentThemeValues;
      if(defaultThemes[themeToCopy])
      {
        // Copy current
        currentThemeValues = defaultThemes[themeToCopy];
        file.themes[currentTheme] = currentThemeValues;

      }

      // Set theme as Custom
      file.selectedTheme = currentTheme;

      // Update the value for the theme
      file.themes[currentTheme][colorType] = colorValue;




    }

    //console.log(req.query);
    console.log("env " + process.env.ENV);
    console.log("NODE_ENV '" + process.env.NODE_ENV + "'");

    
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
    if (err) return console.log(err);

      // Send a message so we know we did our job
      res.send('awesome');

    });



});

module.exports = router;
