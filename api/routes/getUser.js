const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

/*
 * Returns whole row from a selected User based on their ID
 *
 * @param user : the userId
 */
router.get("/", function(req, res, next) {

    var userId = req.query.user;

    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB,
      multipleStatements: false
    })

    // Make sure user only has letters and numbers in it
    const userPattern = /^[A-Za-z0-9]+$/;
    if(!userId.match(userPattern)){
      return res.status(400).json({err: "Invalid user ID!"});
    }

    connection.connect();

    var query = "SELECT * FROM `users` WHERE sessionId = ?";
    var queryParams = [userId];

 
    connection.query(query, queryParams, (err, rows, fields) => {
      if (err) throw err

      res.send(rows[0]);
    })

    connection.end()

});

module.exports = router;
