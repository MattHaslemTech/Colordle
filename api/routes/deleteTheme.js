var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {

    const fs = require('fs');
    const fileName = './../src/files/user-settings.json';
    var file = require('../../src/files/user-settings.json');


    // Get the name of the theme we want to delete
    let themeName = req.query.theme;
    console.log("themeName: " + themeName);

    // Go through the file and delete it
    var data = fs.readFileSync(fileName);
    var customThemes = JSON.parse(data);

    //file.themes = customThemes.filter((theme) => { return theme !== themeName });
    delete file.themes[themeName]

    //console.log("Themes: " + file);


    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      //console.log(JSON.stringify(file));
      //console.log('writing to ' + fileName);
    });


});

module.exports = router;
