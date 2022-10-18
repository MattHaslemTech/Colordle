const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

/*
 * Returns whole row from a selected User based on their ID
 *
 * @param keyName : the key of the row you want returned
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

    var query = "SELECT * FROM `game-results` WHERE ";

    for(var key in req.query)
    {
      query += key + " = '" + req.query[key] + "' AND ";
    }
    query = query.slice(0, -5);

    query += " ORDER BY date DESC";

    connection.query(query, (err, rows, fields) => {
      if (err) throw err
      console.log("Rows: ", rows);
      res.send(rows);
    })

    connection.end()

});

module.exports = router;
