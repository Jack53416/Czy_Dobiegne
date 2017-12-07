"use strict";
var express = require('express');
var router = express.Router();
var fb = require('node-firebird');
var helpers = require('../helpers.js')
var database = require('../database.js');

/**
 * @swagger
 * definitions:
 *   Location:
 *     properties:
 *       id:
 *         type: number
 *         format: integer
 *       price_min:
 *         type: number
 *         format: double
 *       price_max:
 *         type: number
 *         format: double
 *       rating:
 *         type: number
 *         format: double
 *       vote_nr:
 *         type: number
 *         format: integer
 *       date_added:
 *         type: string
 *         format: date-time
 *       name:
 *         type: string
 *       city:
 *         type: string
 *       street:
 *         type: string
 *       longitude:
 *         type: number
 *         format: double
 *       latitude:
 *         type: number
 *         format: double
 *   ApiResponse:
 *     type: object
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 */

/**
  * @swagger
  * securityDefinitions:
  *   userAuthorization:
  *     type: apiKey
  *     name: x-access-token
  *     in: header
 */

 /**
   * @swagger
   * securityDefinitions:
   *   apiClientAuthorization:
   *     type: apiKey
   *     name: x-client-token
   *     in: header
  */


 /**
  * @swagger
  * /test/:
  *   get:
  *     tags:
  *       - Test
  *     description: Returns frist 200 locations in the database
  *     produces:
  *       - application/json
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
  *
  *       500:
  *         description: general server error
  */

router.get("/", function (req, res, next) {
  var queryOptions = new database.QueryOptions(200, 0, '*');
  database.getLocations(queryOptions, res, next);
},
  function(req, res){
    res.json(res.locals.queryResult);
  });


function ErrorHandlerGeneric(err, req, res, nex){
  res.status(500).json({"success":false, message:err.message});
}

router.use(ErrorHandlerGeneric);

module.exports = router;
