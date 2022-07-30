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
 */
router.get("/", function(req, res, next) {

    var user = req.query.user;
    var value = req.query.value;
    var themeName = req.query.themeName;

    // Remove Hyphens from value
    value = value.replace(new RegExp('-', 'g'),"");


    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB
    })

    connection.connect();

    var query = 'INSERT INTO customthemes (themeName) VALUES(' + themeName +  ')';

    connection.query(query, (err, rows, fields) => {
      if (err) throw err

      console.log('The solution is: ', rows[0][value])

      res.send(rows[0][value]);
    })

    connection.end()

});

module.exports = router;
