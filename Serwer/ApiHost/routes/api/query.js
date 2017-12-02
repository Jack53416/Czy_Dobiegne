"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var helpers = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');

router.use(authorize.verifyToken);

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


router.get('/locations', function(req, res, next){
  assert.ok(req.query.hasOwnProperty('latitude'), "No latitude conditions provided");
  assert.ok(req.query.latitude.length > 0, "No latitude expression provided!");
  assert.ok(req.query.hasOwnProperty('longitude'), "No longitude conditions provided");
  assert.ok(req.query.latitude.length > 0, "No latitude expression provided!");

  var querySettings = helpers.validateStandardQuery(req.query);

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

},
  function(req, res){
    res.json(res.locals.queryResult);
});

module.exports = router;
