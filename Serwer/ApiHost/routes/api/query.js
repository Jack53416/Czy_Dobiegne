"use-strict"

var express = require('express');
var router  = express.Router();

const {escape} = require("node-firebird");
var assert = require('assert');
var validator = require('validator');
var helpers = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');


//router.use(authorize.verifyToken);

/**
 * @swagger
 * /api/query/locations:
 *   get:
 *     security:
 *       - userAuthorization: []
 *       - apiClientAuthorization: []
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
 *
 *       - name: longitude
 *         description: simple condition list for longitude ex <=19.233
 *         in: query
 *         required: true
 *         type: array
 *         items:
 *           type: string
 *
 *       - name: rating
 *         description: condition list for rating parameters
 *         in: query
 *         required: false
 *         type: string
 *
 *       - name: price_max
 *         description: condition list for price_max parameter
 *         in: query
 *         required: false
 *         type: string
 *
 *       - name: price_min
 *         description: condition list for price_min parameter
 *         in: query
 *         required: false
 *         type: string
 *
 *       - name: street
 *         description: street name to query
 *         in: query
 *         required: false
 *         type: string
 *         
 *       - name: validated
 *         description: boolean flag, default = true
 *         in: query
 *         required: false
 *         type: boolean
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


router.get('/locations', function(req, res, next){

  var re = /^([><=]|>=|<=)(\d+(\.\d+)?)$/;
  var re2 = /^([><=]|>=|<=)*$/;
  var addToQuery = '';

  //szerokosc
  assert.ok(req.query.hasOwnProperty('latitude'), "No latitude conditions provided");
  assert.ok(req.query.latitude.length > 0, "No latitude expression provided!");

  //dlugosz
  assert.ok(req.query.hasOwnProperty('longitude'), "No longitude conditions provided");
  assert.ok(req.query.latitude.length > 0, "No latitude expression provided!");

  //rating
  ///w taki sposób zbudowane poniewaz moze nie byc elementu rating
  if(typeof req.query.rating !== 'undefined'){
    assert.ok(req.query.rating.length > 0, "No rating conditions provided");
    assert.ok(re.exec(req.query.rating) != null, "Invalid expression " + req.query.rating);
    addToQuery = addToQuery + " AND RATING " + req.query.rating;
  }

  //price min
  if(typeof req.query.price_max !== 'undefined'){
    assert.ok(req.query.price_max.length > 0, "No price_max conditions provided");
    assert.ok(re.exec(req.query.price_max) != null, "Invalid expression " + req.query.rating);
    addToQuery = addToQuery + " AND PRICE_MAX " + req.query.price_max;
  }

  //price max
  if(typeof req.query.price_min !== 'undefined'){
    assert.ok(req.query.price_min.length > 0, "No price_min conditions provided");
    assert.ok(re.exec(req.query.price_min) != null, "Invalid expression " + req.query.rating);
    addToQuery = addToQuery + " AND PRICE_MIN " + req.query.price_min;
  }

  //street
  if(typeof req.query.street !== 'undefined'){
    assert.ok(req.query.street.length > 0, "No rating conditions provided");
    addToQuery = addToQuery + " AND LOWER(STREET) LIKE LOWER('%" + req.query.street + "%') ";
  }

  if(req.query.hasOwnProperty('validated')){
    assert.ok(validator.isBoolean(req.query.validated), req.query.validated + " is invlaid boolean value");
    let validated = 'Y';
    if(req.query.validated == 'false')
    {
      validated = 'N';
    }
    addToQuery += " AND VALIDATED =" + escape(validated);
  }
  else{
    addToQuery += " AND VALIDATED = " + escape('Y');
  }

  var querySettings = helpers.validateStandardQuery(req.query);
  var longitude = req.query.longitude.split(',');
  var latitude = req.query.latitude.split(',');

  longitude.forEach( (item, idx, array) =>{
    assert.ok(re.exec(item) != null, "Invalid expression " + item);
    array[idx] =  item.replace(re, "LONGITUDE $1 $2");
  });

  latitude.forEach( (item, idx, array) =>{
    assert.ok(re.exec(item) != null, "Invalid expression " + item);
    array[idx] =  item.replace(re, "LATITUDE $1 $2");
  });

  var whereQuery = latitude.join(" AND ") + " AND " + longitude.join( " AND ") + addToQuery;
  database.getLocations(new database.QueryOptions(querySettings.count, querySettings.offset, querySettings.fields, whereQuery ), res, next);

},
  function(req, res){
    res.status(200).json(res.locals.queryResult);
});

module.exports = router;
