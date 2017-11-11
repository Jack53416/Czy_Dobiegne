"use strict";
var express = require('express');
var router = express.Router();
var fb = require('node-firebird');
var helpers = require('../helpers.js')
var database = require('../database.js');



router.get("/", function (req, res, next) {
  var count = 200;
  var offset = 0;
  var fields = '*';
  fb.attach(database.dbOptions, function(err, db){
    if(err)
      throw err;
      var sqlQuery = "SELECT FIRST " + count + " SKIP " + offset + " " +
                     helpers.escapeColumnNames(fields) + " FROM TOILET_VIEW";
      db.query(sqlQuery, function(err, queryResult){
        db.detach();
        if(err)
          return next(err);
        res.json({"count": queryResult.length , "offset": offset, "data": queryResult});
      });
  });
});


function ErrorHandlerGeneric(err, req, res, nex){
  res.status(500).json({"success":false, message:err.message});
}

router.use(ErrorHandlerGeneric);

module.exports = router;
