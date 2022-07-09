const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

/*
 * Get a color Value from a theme
 *
 * @param user (ex: jBN7m68PzvP8sL5)
 * @param value (ex: navbar-bg-color)
 * @param themeName (ex: Custom0)
 *
 * If themeName isn't set, return all of user's themes
 * If value isn't set, return all whole theme row.
 */
router.get("/", function(req, res, next) {

    var user = req.query.user;


    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB
    })

    connection.connect();

    var query = 'SELECT * FROM `custom-themes` WHERE creatorId="' + user + '"';

    // If a themeName is set, add it to the query
    if(req.query.themeName)
    {
      query += ' AND themeName="' + req.query.themeName + '"';
    }

    console.log("query: " + query);

    connection.query(query, (err, rows, fields) => {
      if (err) throw err

      // If a value is set, return just the value
      if(req.query.value)
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
