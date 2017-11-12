"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var validator = require('validator');
var sqlWhereParser = require('sql-where-parser');

var helpers = require('../helpers.js');
var authorize = require('../authorize.js');
var database = require('../database.js');

const sqlParser =  new sqlWhereParser();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags:
 *       - Authorize
 *     description: returns a jwt token used for further authorization
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: username of a user to be authorized
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: password
 *         description: password of a user to be authorized
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: authorization success
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             token:
 *               type: string
 *             message:
 *               type: string
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 */

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
                            "message": "Token valid 30 minutes"});
  }
});

router.post('/cry', function(req,res, next){
  var salt = helpers.generateSalt();
  res.json({"result": helpers.hashData('sha256',req.body.message + salt,'base64'),
            "salt": salt});
});

router.use(authorize.verifyToken);

/**
 * @swagger
 * /api/user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     description: Adds a new user
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: username of a new user
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: email
 *         description: valid email of a new user
 *         in: formData
 *         required: true
 *         type: string
 *         format: email
 *
 *       - name: password
 *         description: password of a new user
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: user added succesfully
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *
 *
 */

router.post('/user', function(req, res, next){
  assert.equal(req.decoded.permissions, 'admin', "Access denied!");
  validateUserRequestData(req);

  var newUserData = new database.UserData(req.body.username, req.body.email, req.body.password);
  database.addUser(newUserData, next);
}, function(req, res){
  res.json({"success": true, "message": "user added Successfully"});
});

/**
 * @swagger
 * /api/user:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     description: Modifies existing user. In case field doesn't need to be changed send old data
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: new username for the current user
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: email
 *         description: new name for a current user
 *         in: formData
 *         required: true
 *         type: string
 *         format: email
 *
 *       - name: password
 *         description: new password for current user
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: user updated succesfully
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *
 *
 */
router.put('/user', function(req, res, next){
  validateUserRequestData(req);
  var modifiedUserData = new database.UserData(req.body.username, req.body.email, req.body.password);
  database.updateUser(modifiedUserData, req.decoded.userID, next);

}, function(req, res){
   res.json({"sucess": true, "message": "Data updated successfully"});
});


/**
 * @swagger
 * /api/locations/{city}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Locations
 *     description: Returns a list of locations
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: city
 *         description: city name for which query returns the Locations
 *         in: path
 *         required: true
 *         type: string
 *
 *       - name: count
 *         description: max records in response, limit = 200
 *         in: query
 *         required: false
 *         type: number
 *         format: integer
 *         minimum: 0
 *         maximum: 200
 *
 *       - name: offset
 *         description: offset for records (0 .. n)
 *         in: query
 *         required: false
 *         type: number
 *         format: integer
 *
 *       - name: fields
 *         description: comma separated array list of fields to be returned by the request - * for all
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: response object with location list
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: integer
 *             offset:
 *               type: integer
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Location'
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 */

 router.get('/locations/:city', function(req, res, next){
   var count = 200;
   var offset = 0;
   var fields = "";
   var city = "";

   var querySettings = validateStandardQuery(req.query);
   database.getLocations(new database.QueryOptions(querySettings.count, querySettings.offset, querySettings.fields, 'CITY = ?', [req.params.city]), res, next);

 });

 /**
  * @swagger
  * /api/query/locations:
  *   get:
  *     security:
  *       - bearerAuth: []
  *     tags:
  *       - Locations
  *     description: Returns a list of locations for a specified query
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: latitude
  *         description: simple condition list for latitude ex.>50.23
  *         in: query
  *         required: true
  *         type: array
  *         items:
  *           type: string
  *       - name: longitude
  *         description: simple condition list for longitude ex <=19.233
  *         in: query
  *         required: true
  *         type: array
  *         items:
  *           type: string
  *
  *       - name: count
  *         description: max records in response, limit = 200
  *         in: query
  *         required: false
  *         type: number
  *         format: integer
  *         minimum: 0
  *         maximum: 200
  *
  *       - name: offset
  *         description: offset for records (0 .. n)
  *         in: query
  *         required: false
  *         type: number
  *         format: integer
  *
  *       - name: fields
  *         description: comma separated array list of fields to be returned by the request - * for all
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: response object with location list
  *         schema:
  *           type: object
  *           properties:
  *             count:
  *               type: integer
  *             offset:
  *               type: integer
  *             data:
  *               type: array
  *               items:
  *                 $ref: '#/definitions/Location'
  *       500:
  *         description: general server error
  *         schema:
  *           $ref: '#/definitions/ApiResponse'
  */

 router.get('/query/locations', function(req, res, next){
   assert.ok(req.query.hasOwnProperty('latitude'), "No latitude conditions provided");
   assert.ok(req.query.latitude.length > 0, "No latitude expression provided!");
   assert.ok(req.query.hasOwnProperty('longitude'), "No longitude conditions provided");
   assert.ok(req.query.latitude.length > 0, "No latitude expression provided!");

   var querySettings = validateStandardQuery(req.query);

   var longitude = req.query.longitude.split(',');
   var latitude = req.query.latitude.split(',');
   var re = /^([><=]|>=|<=)(\d+(\.\d+)?)$/;
   longitude.forEach( (item, idx, array) =>{
     assert.ok(re.exec(item) != null, "Invalid expression " + item);
     array[idx] =  item.replace(re, "LONGITUDE $1 $2");
   });

   latitude.forEach( (item, idx, array) =>{
     assert.ok(re.exec(item) != null, "Invalid expression " + item);
     array[idx] =  item.replace(re, "LATITUDE $1 $2");
   });
   var whereQuery = latitude.join(" AND ") + " AND " + longitude.join( " AND ");
   database.getLocations(new database.QueryOptions(querySettings.count, querySettings.offset, querySettings.fields, whereQuery), res, next);

 });

router.use(ErrorHandlerGeneric);


function validateStandardQuery(query){
  var count = 200;
  var offset = 0;
  var fields = "";

  assert.ok(query.hasOwnProperty('fields'), 'No fields property');
  assert.ok(query.fields.length > 0, 'No fields specified');

  fields = query.fields;

  if(query.hasOwnProperty('count')){
     assert.ok(validator.isInt(query.count, {"min":1, "max": 200}), 'count should be a value between 1 and 200');
     count = parseInt(query.count);
  }

  if(query.hasOwnProperty('offset')){
    assert.ok(validator.isInt(query.offset), 'offset is invalid');
    offset = parseInt(query.offset);
  }
  return {count: count, offset: offset, fields : fields};

}
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
