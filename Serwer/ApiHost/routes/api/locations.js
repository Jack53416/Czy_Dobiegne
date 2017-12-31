"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var validator = require('validator');
var helpers = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');

const { InvalidRequestError, ForbiddenAccessError } = require('../../helpers.js');

router.use(authorize.verifyToken);

/**
 * @swagger
 * /api/locations/{city}:
 *   get:
 *     security:
 *       - userAuthorization: []
 *       - apiClientAuthorization: []
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
 *             total:
 *               type: integer
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Location'
 *       401:
 *         description: Access denied
 *         schema:
 *           $ref: '#/definitions/ApiError'
 *       500:
 *         description: general server error, apart from general information, stack treace will be provided
 *         schema:
 *           $ref: '#/definitions/ApiError'
 *       501:
 *         description: Sql Error, something went wrong during sql query
 *         schema:
 *           $ref: '#/definitions/ApiError'
 */

 router.get('/:city', function(req, res, next){
   var count = 200;
   var offset = 0;

   var querySettings = helpers.validateStandardQuery(req.query);
   var city = req.params.city.toLocaleLowerCase();

   database.getLocations(new database.QueryOptions(querySettings.count, querySettings.offset, querySettings.fields, 'LOWER(CITY) = ?', [city]), res, next);
 },
  function(req, res){
      res.json(res.locals.queryResult);
 });


 /**
  * @swagger
  * /api/locations/validationStatus:
  *   put:
  *     security:
  *       - userAuthorization: []
  *     tags:
  *       - Locations
  *     description: Changes the validation status for the Location
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: status
  *         description: new Validation status for locations with given ids
  *         in: query
  *         required: true
  *         type: boolean
  *
  *       - name: idLocations
  *         description: simple list of locations ids
  *         in: query
  *         required: true
  *         type: array
  *         items:
  *           type: number
  *           format: integer
  *
  *     responses:
  *       200:
  *         description: location
  *         schema:
  *           type: object
  *           properties:
  *             count:
  *               type: integer
  *             offset:
  *               type: integer
  *             total:
  *               type: integer
  *             data:
  *               type: array
  *               items:
  *                 $ref: '#/definitions/Location'
  *       401:
  *         description: Access denied
  *         schema:
  *           $ref: '#/definitions/ApiError'
  *       500:
  *         description: general server error, apart from general information, stack treace will be provided
  *         schema:
  *           $ref: '#/definitions/ApiError'
  *       501:
  *         description: Sql Error, something went wrong during sql query
  *         schema:
  *           $ref: '#/definitions/ApiError'
  */



router.put('/validationStatus', function(req, res, next){
  console.log(req.decoded);
  if(req.decoded.permissions !== 'admin'){
    return next(new ForbiddenAccessError("Access denied!"));
  }

  if(!req.query.hasOwnProperty("status")){
    return next(new InvalidRequestError("status field required!"));
  }
  if(!req.query.hasOwnProperty("idLocations")){
    return next( new InvalidRequestError("idLocations field requred"));
  }

  assert.ok(validator.isBoolean(req.query.status), req.query.status + " is invalid Boolean");
  assert.ok(req.query.idLocations.length > 0, "idLocations is invalid!");

  req.query.idLocations = req.query.idLocations.replace(/ /g, '');

  let validated = (req.query.status == "true");
  if(validated){
    validated = "Y";
  }
  else{
    validated = "N";
  }

  let idArray = req.query.idLocations.split(",");
  assert.ok(idArray.length > 0, "invalid idLocations!");
  let whereString = 'ID IN (';
  for(let id of idArray){
    assert.ok(validator.isInt(id, {min:0}), id + " is invalid id");
    whereString += "?,";
  }
  whereString = whereString.slice(0, -1);
  whereString += ')';

  database.updateTable('TOILETS', ['validated'], [validated], whereString, idArray, next);
},
  function(req, res){
    res.status(200).json({success: true, message: "Validation status succesfully updated"});
  });


 module.exports = router;
