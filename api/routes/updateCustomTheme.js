var express = require("express");
var router = express.Router();
const mysql = require('mysql');
/*
 * Update the current user's setting in 'users' table
 *
 * @param userid : sessionId of the current user
 * @param keyName : the column to change
 * @param value : the value to set in the column
 */

router.get("/", function(req, res, next) {

  // Save the query variables
  let userId = req.query.creatorId;
  let themeName = req.query.themeName;


  // Make sure key only has letters in it
  const userPattern = /^[A-Za-z0-9]+$/;
  if(!userId.match(userPattern)){
    return res.status(400).json({err: "Invalid key!"});
  }

  console.log("Query: ", req);

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    multipleStatements: false
  })


  connection.connect();

  let query = "UPDATE `custom-themes` SET ";

  for(var key in req.query)
  {
    query += key + " = '" + req.query[key] + "', ";
  }

  // remove trailing comma
  query = query.slice(0, -2);

  query += " WHERE creatorId = '" + userId + "' AND themeName = '" + themeName + "'";
  console.log(query);

  connection.query(query, (err, rows, fields) => {
    if (err) throw err

    res.send("User '" + userId + "' updated.");

  })

  connection.end()

    /*
    const fs = require('fs');
    const fileName = './../src/files/user-settings.json';
    const file = require('../../src/files/user-settings.json');

    var defaultThemes = require('../../src/files/themes.json');
    */

    // Save the new theme name parameter
    /*
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
    */

    /*
     * Save the new color value
     *
     * @param colorValue: The color value to save
     * @param colorType : The name of the value to save
     */
     /*
    if(req.query.r && req.query.g && req.query.b && req.query.a)
    {
      var colorType = req.query.colorType;

      var colorValue = "rgba(" + req.query.r + "," + req.query.g + "," + req.query.b + "," + req.query.a + ")";
      */

      /*
       * We need to copy all the values of the selected theme into our custom
       * theme and set our selected theme as Custom
       */

       /*
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
    */




});

module.exports = router;
