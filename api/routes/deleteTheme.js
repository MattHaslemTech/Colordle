const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

/*
 * Delete's a theme
 *
 * @param user : the session id of the user
 * @param themeName : The name of the theme to delete
 */
router.get("/", function(req, res, next) {

    if(!req.query.user || !req.query.themeName)
    {
      res.send("Incorrect query");
      return;
    }

    var userId = req.query.user;
    var themeName = req.query.themeName;

    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB
    })

    connection.connect();

    var query = "DELETE FROM `custom-themes` WHERE creatorId='" + userId + "' AND themeName='" + themeName + "'";


    connection.query(query, (err, rows, fields) => {
      if (err) throw err

    })

    connection.end()

});

module.exports = router;
