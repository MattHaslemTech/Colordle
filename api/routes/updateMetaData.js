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

    var keyName = req.query.keyName;
    var valueData = req.query.valueData;

    var time;
    if(req.query.time)
    {
      time = req.query.time;
    }
    else
    {
      time = new Data().setUTCHours(0,0,0,0);
      time = time.toISOString().slice(0, 19).replace('T', ' '); // This sets it to SQL standard
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

    var query = "UPDATE `meta-data` SET valueData = ?, time = ? WHERE keyName = ?";
    var queryParams = [valueData, time, keyName];



    connection.query(query, queryParams, (err, rows, fields) => {
      if (err) throw err
      console.log("Rows: ", rows[0]);
      res.send(rows[0]);
    })

    connection.end()

});

module.exports = router;
