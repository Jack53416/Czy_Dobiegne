"use-strict"

var express = require('express');
var router  = express.Router();
var firebird = require('node-firebird');
var assert = require('assert');
var helpers = require('../helpers.js');
var jwt = require('jsonwebtoken');

var dbOptions = {};

router.post('/auth', function(req, res, next){
  assert.ok(req.body.hasOwnProperty('password'), 'no password given!');
  assert.ok(req.body.hasOwnProperty('username'), 'no username given!');

  dbOptions = helpers.readJSONFile("fb-config.json");
  findUser(req.body.username, res, next);
}, function(req, res, next){
  if(checkCredentials(res.locals.userData, req.body.password) === false){
    next(new Error("Invalid password!"));
  }
  else{
      const payload = {
        "userType":"regularUser"
      };

      var token = jwt.sign(payload, 'secretToken', {"expiresIn" : 300});
      res.status(200).json({"success": true,
                            "token": token,
                            "message": "Token valid 5 minutes"});
  }

});

router.use(ErrorHandlerGeneric);

function checkCredentials(userData, requestPassword){
  if(userData.PASSWORD == requestPassword ){
    return true;
  }
  return false;
}

/**
 * finds if user with given username or email exists in database
 * @param  {string}   username username or email
 * @param  {object}   res      response express object
 * @param  {Function} callback expess next callback
 * @return {Function}           callback invocation
 */
function findUser(username, res, callback){
    assert.equal(typeof(username), 'string',
        "argument must be string!");
    assert.ok(username.length <= 40, "username too long!");

    firebird.attach(dbOptions, function(err, db){
      if(err){
        return callback(err);
      }
      var usr = firebird.escape(username);
      db.query("SELECT USERNAME, EMAIL, PASSWORD, SALT FROM USERS WHERE USERNAME = ? OR EMAIL = ?",
               [username, username], function(err, queryResult){
                db.detach();
                if(err){
                  throw err;
                }
                console.log(queryResult);
                if(queryResult.length === 0){
                  return callback(new Error("Invalid User!"));
                }
                res.locals.userData = queryResult[0];
                return callback();
              });

    });
}

function ErrorHandlerGeneric(err, req, res, nex){
  res.status(500).json({"success":false, message:err.message});
}
module.exports = router;
