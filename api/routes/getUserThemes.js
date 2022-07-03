const db = require('../db');
const mysql = require('mysql');
var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {

    //console.log(req.query);
    console.log("env " + process.env.ENV);
    console.log("NODE_ENV '" + process.env.NODE_ENV + "'");

    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB
    })

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
      if (err) throw err

      console.log('The solution is: ', rows[0].solution)
    })

    connection.end() 

});

module.exports = router;
