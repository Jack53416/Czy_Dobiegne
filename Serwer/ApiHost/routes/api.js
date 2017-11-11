"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var validator = require('validator');
var helpers = require('../helpers.js');
var authorize = require('../authorize.js');
var database = require('../database.js');

router.post('/auth', function(req, res, next){
  assert.ok(req.body.hasOwnProperty('password'), 'no password given!');
  assert.ok(req.body.hasOwnProperty('username'), 'no username given!');
  database.findUser(req.body.username, res, next);

}, function(req, res, next){
  if(!authorize.checkCredentials(res.locals.userData, req.body.password)){
    return next(new Error("Invalid password!"));
  }
  else{
      var payload = new authorize.TokenPayload(res.locals.userData.id, res.locals.userData.permissions);
      console.log(payload);
      var token = payload.getToken();

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


router.use(authorize.verifyToken);

router.post('/users', function(req, res, next){
  assert.equal(req.decoded.permissions, 'admin', "Access denied!");
  validateUserRequestData(req);

  var newUserData = new database.UserData(req.body.username, req.body.email, req.body.password);
  database.addUser(newUserData, next);
}, function(req, res){
  res.json({"success": true, "message": "user added Successfully"});
});


router.put('/users', function(req, res, next){
  validateUserRequestData(req);
  var modifiedUserData = new database.UserData(req.body.username, req.body.email, req.body.password);
  database.updateUser(modifiedUserData, req.decoded.userID, next);

}, function(req, res){
   res.json({"sucess": true, "message": "Data updated successfully"});
});

router.get('/locations', function(req, res, next){
  var count = 200;
  var offset = 0;
  var fields = "";
  assert.ok(req.query.hasOwnProperty('fields'), 'No fields property');
  assert.ok(req.query.fields.length > 0, 'No fields specified');
  fields = req.query.fields;

  if(req.query.hasOwnProperty('count')){
     assert.ok(validator.isInt(req.query.count, {"min":1, "max": 200}), 'count should be a value between 1 and 200');
     count = parseInt(req.query.count);
  }

  if(req.query.hasOwnProperty('offset')){
    assert.ok(validator.isInt(req.query.offset), 'offset is invalid');
    offset = parseInt(req.query.offset);
  }

  database.getLocations(count, offset, fields, res, next);

});
router.use(ErrorHandlerGeneric);

/**
 * validetes username, email, password in request containting userData
 * @param  {req} req request express object
 */
function validateUserRequestData(req){
  assert.ok(req.body.hasOwnProperty('username'), "username field required");
  assert.ok(req.body.hasOwnProperty('email'), "email field required");
  assert.ok(req.body.hasOwnProperty('password'), "password field required");
  assert.ok(validator.isLength(req.body.password, {"min":6, "max":100}), "Password should be between 6 and 100 characters");
  assert.ok(validator.isEmail(req.body.email), "Ivalid email provided");
  assert.ok(validator.isLength(req.body.username, {"min": 6, "max": 40}), "Username should be between 6 and 40 characters");
}

function ErrorHandlerGeneric(err, req, res, nex){
  res.status(500).json({"success":false, message:err.message});
}
module.exports = router;
