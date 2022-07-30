const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

/*
 * Insert User into DB
 *
 * @param user : the userId
 */
router.get("/", function(req, res, next) {

    var userId = req.query.user;

    // Make sure user only has letters and numbers in it
    const userPattern = /^[A-Za-z0-9]+$/;
    if(!userId.match(userPattern)){
      return res.status(400).json({err: "Invalid user ID!"});
    }

    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB,
      multipleStatements: false
    })

    connection.connect();

    var query = "INSERT INTO `users` (sessionId) VALUES ( ? )";
    var queryParams = [userId];

    console.log(query);

    connection.query(query, queryParams, (err, rows, fields) => {
      if (err) throw err
      console.log(rows);

      res.send(rows);
    })

    connection.end()

});

module.exports = router;
