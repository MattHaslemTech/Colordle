var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {

    const fs = require('fs');
    const fileName = './../src/files/user-settings.json';
    const file = require('../../src/files/user-settings.json');

    // Get new theme name parameter
    var themeName = req.query.theme;

    file.selectedTheme = themeName;

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
      console.log(JSON.stringify(file));
      console.log('writing to ' + fileName);
    });


});

module.exports = router;
