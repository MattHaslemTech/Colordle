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
  let userId = req.query.userId;
  let key = req.query.keyName;
  let value = req.query.value;

  // Make sure key only has letters in it
  const keyPattern = /^[A-Za-z]+$/;
  if(!key.match(keyPattern)){
    return res.status(400).json({err: "Invalid key!"});
  }

  console.log("Query: " + req);
  console.log("Value : " + value);
  console.log("key : " + key);
  console.log("userId : " + userId);

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    multipleStatements: false
  })


  connection.connect();

  let query = "UPDATE users SET " + key + " = ? WHERE sessionId = ?";
  let queryParams = [value, userId];
  //res.send(query);

  connection.query(query, queryParams, (err, rows, fields) => {
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
