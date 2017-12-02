"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var validator = require('validator');

var helpers = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');

//router.use(authorize.verifyToken);

/**
 * @swagger
 * /api/location:
 *   post:
 *     security:
 *       - bearerAuth: []
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
    assert.ok(req.body.hasOwnProperty('country'), "coutry field required!");
    assert.ok(req.body.hasOwnProperty('city'), "city field reqired");
    assert.ok(req.body.hasOwnProperty('street'), "street field required");
    assert.ok(req.body.hasOwnProperty('longitude'), "longitude field required");
    assert.ok(req.body.hasOwnProperty('latitude'), 'latitude field required');

    var location = new Location(
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
      assert(validator.isInt(req.body.price_min, {min :0}), "Invalid price_min!");
      location.price_min = req.body.price_min;
    }
    if(req.body.hasOwnProperty('price_max')){
      assert(validator.isInt(req.body.price_max, {min :0}), "Invalid price_max!");
      location.price_max = req.body.price_max;
    }
    if(req.body.hasOwnProperty('description')){
      location.description = req.body.description;
    }

    database.addLocation(location, res, next);
},
 function(req, res){
  res.json({"success": true, "message": res.locals.queryResultMessage});
});




function Location(country, city, street, longitude, latitude, name, price_min,
                  price_max, description){
  this.country = country;
  this.city = city;
  this.street = street;
  this.longitude = longitude;
  this.latitude = latitude;
  this.name = typeof name !== 'undefined' ? name : null;
  this.price_min = typeof price_min !== 'undefined' ? price_max : 0;
  this.price_max = typeof price_max !== 'undefined' ? price_max : this.price_min;
  this.description = typeof description !== 'undefined' ? description : null;
}
module.exports = router;
