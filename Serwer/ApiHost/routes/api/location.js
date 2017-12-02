"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var validator = require('validator');

var helpers = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');

router.use(authorize.verifyToken);

/**
 * @swagger
 * /api/location:
 *   post:
 *     security:
 *       - userAuthorization: []
 *     tags:
 *       - Locations
 *     description: Adds new location
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: name of the location
 *         in: formData
 *         required: false
 *         type: string
 *
 *       - name: country
 *         description: coutry name
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: city
 *         description: city name
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: street
 *         description: full street name with property Number
 *         in: formData
 *         required: true
 *         type: string
 *
 *       - name: longitude
 *         description: longitude value of the location
 *         in: formData
 *         required: true
 *         type: number
 *         format: double
 *
 *       - name: latitude
 *         description: latitude value of the location
 *         in: formData
 *         required: true
 *         type: number
 *         format: double
 *
 *       - name: price_min
 *         description: minimal price of the toilet's service, by default 0
 *         in: formData
 *         required: false
 *         type: number
 *         format: double
 *
 *       - name: price_max
 *         description: maximal price of the toilet's service, by default same as price_min
 *         in: formData
 *         required: false
 *         type: number
 *         format: double
 *
 *       - name: description
 *         description: toilet's description, max 200 characters, by default empty
 *         in: formData
 *         required: false
 *         type: string
 *
 *     responses:
 *       200:
 *         description: location added successfully
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *
 *
 */
router.post('/', function(req, res, next){
    checkForRequestParams(['country', 'city', 'street', 'longitude', 'latitude'], req.body);
    assert.ok(validator.isDecimal(req.body.longitude), 'longitude is not a number');
    assert.ok(validator.isDecimal(req.body.latitude), 'latitude is not a number');
    var location = new database.Location(
      req.body.country,
      req.body.city,
      req.body.street,
      req.body.longitude,
      req.body.latitude
    );
    if(req.body.hasOwnProperty("name")){
      location.name = req.body.name;
    }
    if(req.body.hasOwnProperty('price_min')){
      assert(validator.isDecimal(req.body.price_min, {min :0}), "Invalid price_min!");
      location.price_min = req.body.price_min;
    }
    if(req.body.hasOwnProperty('price_max')){
      assert(validator.isDecimal(req.body.price_max, {min :0}), "Invalid price_max!");
      location.price_max = req.body.price_max;
    }
    if(req.body.hasOwnProperty('description')){
      location.description = req.body.description;
    }

    database.addLocation(location, res, next);
},
 function(req, res){
  res.json({"success": true, "message": res.locals.queryResult.message});
});


/**
 * @swagger
 * /api/location/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Locations
 *     description: Edits current location, only id is required, the rest of the parameters are optional and only those that are sent will be updated
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id of the currently edited locations
 *         in: path
 *         required: true
 *         type: number
 *         format: integer
 *
 *       - name: name
 *         description: name of the location
 *         in: formData
 *         required: false
 *         type: string
 *
 *       - name: country
 *         description: coutry name
 *         in: formData
 *         required: false
 *         type: string
 *
 *       - name: city
 *         description: city name
 *         in: formData
 *         required: false
 *         type: string
 *
 *       - name: street
 *         description: full street name with property Number
 *         in: formData
 *         required: false
 *         type: string
 *
 *       - name: longitude
 *         description: longitude value of the location
 *         in: formData
 *         required: false
 *         type: number
 *         format: double
 *
 *       - name: latitude
 *         description: latitude value of the location
 *         in: formData
 *         required: false
 *         type: number
 *         format: double
 *
 *       - name: price_min
 *         description: minimal price of the toilet's service, by default 0
 *         in: formData
 *         required: false
 *         type: number
 *         format: double
 *
 *       - name: price_max
 *         description: maximal price of the toilet's service, by default same as price_min
 *         in: formData
 *         required: false
 *         type: number
 *         format: double
 *
 *       - name: description
 *         description: toilet's description, max 200 characters, by default empty
 *         in: formData
 *         required: false
 *         type: string
 *
 *     responses:
 *       200:
 *         description: location added successfully
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *       500:
 *         description: general server error
 *         schema:
 *           $ref: '#/definitions/ApiResponse'
 *
 *
 */

router.put('/:id', function(req, res, next){
    var id = req.params.id;
    next();
/*    var queryOptions = new database.QueryOptions(1 , 0, '*', 'TOILETS.ID=?', [id]);
    database.getLocations(queryOptions, res, next);*/
},
  function(req, res){
    res.json({success: true, message: 'Toilet with id: ' + req.params.id + ' updated sucessfully'});
});

function checkForRequestParams(requiredParams, body){
  for(param of requiredParams){
      assert.ok(body.hasOwnProperty(param), param + " field required!");
  }
}

module.exports = router;
