"use-strict"

var express = require('express');
var router  = express.Router();

var helpers = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');

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
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Location'
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 */

 router.get('/:city', function(req, res, next){
   var count = 200;
   var offset = 0;
   var fields = "";
   var city = "";

   var querySettings = helpers.validateStandardQuery(req.query);
   database.getLocations(new database.QueryOptions(querySettings.count, querySettings.offset, querySettings.fields, 'CITY = ?', [req.params.city]), res, next);
 },
  function(req, res){
      res.json(res.locals.queryResult);
 });

 module.exports = router;
