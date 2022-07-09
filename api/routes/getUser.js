const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

/*
 * Returns whole row from a selected User based on their ID
 */
router.get("/", function(req, res, next) {

    var userId = req.query.user;

    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB
    })

    connection.connect();

    var query = "SELECT * FROM `users` WHERE sessionId='" + userId + "'";


    connection.query(query, (err, rows, fields) => {
      if (err) throw err
      
      res.send(rows);
    })

    connection.end()

});

module.exports = router;
