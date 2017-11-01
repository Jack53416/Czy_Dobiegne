"use-strict"

var express = require('express');
var router  = express.Router();
var firebird = require('node-firebird');
var assert = require('assert');
var helpers = require('../helpers.js');
var jwt = require('jsonwebtoken');
var validator = require('validator');

var dbOptions = {};
var secretTokenKey = 'secretTokenKey';

router.use(function(req, res, next){
  dbOptions = helpers.readJSONFile("fb-config.json");
  next();
});

router.post('/auth', function(req, res, next){
  assert.ok(req.body.hasOwnProperty('password'), 'no password given!');
  assert.ok(req.body.hasOwnProperty('username'), 'no username given!');


  findUser(req.body.username, res, next);
}, function(req, res, next){
  if(checkCredentials(res.locals.userData, req.body.password) === false){
    next(new Error("Invalid password!"));
  }
  else{
      const payload = {
        "userID": res.locals.userData.ID,
        "permissions": res.locals.userData.PERMISSIONS
      };

      var token = jwt.sign(payload, secretTokenKey, {"expiresIn" : 300});
      res.status(200).json({"success": true,
                            "token": token,
                            "message": "Token valid 5 minutes"});
  }

});


router.post('/cry', function(req,res, next){
  var salt = helpers.generateSalt();
  res.json({"result": helpers.hashData('sha256',req.body.message + salt,'base64'),
            "salt": salt});
});


router.use(verifyToken);

router.put('/user', function(req, res, next){
  assert.equal(req.decoded.permissions, 'admin', "Access denied!");
  validateUserRequestData(req);

  var newUserData = generateNewUserData(req);
  addUser(newUserData, next);
}, function(req, res){
  res.json({"success": true, "message": "user added Successfully"});
});


router.post('/user', function(req, res, next){
  validateUserRequestData(req);
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    var modifiedUserData = generateNewUserData(req);
    var sqlQuery = "UPDATE USERS\
                    SET USERNAME = ?, EMAIL = ?, PASSWORD = ?\
                    WHERE USERS.ID = " + firebird.escape(req.decoded.userID);
   db.query(sqlQuery,
            [modifiedUserData.username, modifiedUserData.email, modifiedUserData.passwordEncrypted],
            function(err, queryResult){
              if(err){
                return next(err);
              }
              db.detach();
              res.json({"sucess": true, "message": "Data updated successfully"});
            });

  });

});
router.use(ErrorHandlerGeneric);


/**
 * generates userData object with data required by the database
 * @param  {object} req request express object
 * @return {object} userData - userData object, contains(username, email, password, passwordEncrypted, salt)
 */
function generateNewUserData(req){
  var newUserData = {
    "username" : req.body.username,
    "email" : req.body.email,
    "password" : req.body.password,
    "passwordEncrypted" : "",
    "salt" : ""
  };

  newUserData.salt = helpers.generateSalt();
  newUserData.passwordEncrypted = helpers.hashData('sha256', newUserData.password + newUserData.salt, 'base64');
  return newUserData;
}

/**
 * validetes username, email, password in request containting userData
 * @param  {object} req request express object
 */
function validateUserRequestData(req){
  assert.ok(req.body.hasOwnProperty('username'), "username field required");
  assert.ok(req.body.hasOwnProperty('email'), "email field required");
  assert.ok(req.body.hasOwnProperty('password'), "password field required");
  assert.ok(validator.isLength(req.body.password, {"min":6, "max":100}), "Password should be between 6 and 100 characters");
  assert.ok(validator.isEmail(req.body.email), "Ivalid email provided");
  assert.ok(validator.isLength(req.body.username, {"min": 6, "max": 40}), "Username should be between 6 and 40 characters");
}

/**
 * adds user to the databsae based od userData
 * @param {object}   userData userData object, contains(username, email, password, passwordEncrypted, salt)
 * @param {Function} callback callback function called after completion
 */
function addUser(userData, callback){
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    var sqlQuery = "INSERT INTO USERS(USERNAME, EMAIL, PASSWORD, SALT, PERMISSIONS) VALUES\
                    (?, ?, ?, ?, 'regularUser')";
    db.query(sqlQuery, [userData.username, userData.email, userData.passwordEncrypted, userData.salt], function(err, QueryResult){
      db.detach();
      if(err){
        return callback(err);
      }
      callback();
    });

  });
}

/**
 * Express function, verifys validity of a token given in req express object
 * @param  {object}   req  express request object
 * @param  {object}   res  express response object
 * @param  {Function} next callback called after completion
 */
function verifyToken(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-acces-token'];
  assert.ok(token, "No token provided, access denied!");
  jwt.verify(token, secretTokenKey, function(err, decoded){
    if(err){
      return next(new Error("Invalid or timed out token"));
    }
    req.decoded = decoded;
    return next();
  });
}

/**
 * checks if requestPassword is valid for a given userData
 * @param  {object} userData         userData object based on data from database
 * @param  {string} requestPassword  password to be checked
 * @return {boolean}                 returns true if credetials are valid, false in other case
 */
function checkCredentials(userData, requestPassword){
  var encryptedFromRequest = helpers.hashData('sha256',
                             requestPassword + userData.SALT,
                             'base64');

  if(userData.PASSWORD === encryptedFromRequest ){
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
        throw err;
      }
      db.query("SELECT ID, USERNAME, EMAIL, PASSWORD, SALT, PERMISSIONS FROM USERS WHERE USERNAME = ? OR EMAIL = ?",
               [username, username], function(err, queryResult){
                db.detach();
                if(err){
                  callback(err);
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
