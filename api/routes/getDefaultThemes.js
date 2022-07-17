
//const db = require('../db');
const mysql = require('mysql2');
var express = require("express");
var router = express.Router();

/*
 * Get a color Value from a theme
 *
 * @param value (ex: navbar-bg-color)
 * @param themeName (ex: Custom0)
 *
 * If themeName isn't set, return all rows
 * If value isn't set, return all whole theme row.
 */
router.get("/", function(req, res, next) {





    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB,
      multipleStatements: false
    })

    connection.connect();

    var queryParams = [];

    //var query = 'SELECT * FROM `custom-themes` WHERE creatorId="' + user + '"';
    var query = 'SELECT * FROM `default-themes`';
    if(req.query.themeName)
    {
      // Make sure theme name only has letters, numbers, spaces, hyphens, or underscores in it
      const themePattern = /^[a-zA-Z0-9-_() ]+$/;
      if(!req.query.themeName.match(themePattern)){
        return res.status(400).json({err: "Invalid Theme Name!"});
      }

      query +=  ' WHERE themeName = ?';
      queryParams.push(req.query.themeName);

    }


    console.log("query: " + query);

    connection.query(query, queryParams, (err, rows, fields) => {
      if (err) throw err

      // Handle if no results
      if(rows.length == 0)
      {
        res.send(rows);
      }
      // If a value is set, return just the value
      else if(req.query.value)
      {
        var value = req.query.value;

        // Remove Hyphens from value
        value = value.replace(new RegExp('-', 'g'),"");

        res.send(rows[0][value]);
      }
      else if (req.query.themeName)
      {
        res.send(rows[0]);
      }
      else
      {
        res.send(rows);
      }

    })

    connection.end()

});

module.exports = router;
