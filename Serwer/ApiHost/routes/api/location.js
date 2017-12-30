"use-strict"

var express = require('express');
var router  = express.Router();

var assert = require('assert');
var validator = require('validator');

var helpers = require('../../helpers.js');
const { InvalidRequestError } = require('../../helpers.js');
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
 *       -  userAuthorization: []
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
 *       401:
 *         description: Access denied
 *         schema:
 *           $ref: '#/definitions/ApiError'
 *       500:
 *         description: general server error, apart from general information, stackt treace will be provided
 *         schema:
 *           $ref: '#/definitions/ApiError'
 *       501:
 *         description: Sql Error, something went wrong during sql query
 *         schema:
 *           $ref: '#/definitions/ApiError'
 *
 */

router.put('/:id', function(req, res, next){
    var id = req.params.id;
    assert(validator.isInt(id, {min: 0}), "Ivalid id parameter!");
    var queryOptions = new database.QueryOptions(1 , 0, '*', 'ID=?', [id]);
    database.getLocations(queryOptions, res, next);
},
  function(req, res, next){
    var oldLocation = res.locals.queryResult.data[0];
    if(typeof oldLocation === 'undefined')
      return next(new InvalidRequestError("Could not find location with id " + req.params.id));

    oldLocation = getOptionalRequestParams(['name', 'country' , 'city', 'street', 'longitude', 'latitude', 'price_min', 'price_max', 'description'],
                              oldLocation, req.body);
    database.updateLocation(oldLocation, res, next);
},
  function(req, res){
      console.log(res.locals.queryResult);
      res.status(200).json({success: true, message: 'Toilet with id: ' + req.params.id + ' updated sucessfully'});
  });

  /**
   * @swagger
   * /api/location/rate/{id}:
   *   put:
   *     security:
   *       -  userAuthorization: []
   *       -  apiClientAuthorization: []
   *     tags:
   *       - Locations
   *     description: Rates the current location in the integer scale from 1 to 5
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
   *       - name: rating
   *         description: rating for that toilet
   *         in: formData
   *         required: true
   *         type: number
   *         format: integer
   *
   *     responses:
   *       200:
   *         description: Rating updated succesfully
   *         schema:
   *           $ref: '#/definitions/ApiResponse'
   *       401:
   *         description: Access denied
   *         schema:
   *           $ref: '#/definitions/ApiError'
   *       500:
   *         description: general server error, apart from general information, stackt treace will be provided
   *         schema:
   *           $ref: '#/definitions/ApiError'
   *       501:
   *         description: Sql Error, something went wrong during sql query
   *         schema:
   *           $ref: '#/definitions/ApiError'
   *
   */


  router.put('/rate/:id', function(req, res, next){
    const id = req.params.id;
    assert(validator.isInt(id, {min: 0}), "Ivalid id parameter!");
    if(req.body.hasOwnProperty('rating')){
      assert(validator.isInt(req.body.rating, {min: 1, max: 5}), "Invalid rating!, should be integer from 1 to 5");
    }
    else{
      return next(new InvalidRequestError("No rating provided!"));
    }
    let queryOptions = new database.QueryOptions(1, 0 ,"rating, vote_nr", "ID=?", [id]);
    database.getLocations(queryOptions, res, next);
  },
    function(req, res, next){
      let location = res.locals.queryResult.data[0];
      if(typeof location === 'undefined'){
        return next(new InvalidRequestError("Could not find location with id " + req.params.id));
      }
      const rating = Number(req.body.rating);
      location.rating = Number(location.rating);
      location.vote_nr = Number(location.vote_nr);
      location.rating = (location.rating * location.vote_nr + rating) / (location.vote_nr + 1);
      location.vote_nr++;
      res.locals.newRating = location.rating;
      database.updateTable(
        'TOILETS',
        ['rating', 'vote_nr'],
        [location.rating, location.vote_nr],
        'ID=?',
        [req.params.id],
        next);
    },
      function(req, res){
        res.status(200).json({success: true, message: 'Rating accepted', newRating: res.locals.newRating });
      });


function checkForRequestParams(requiredParams, body){
  for(param of requiredParams){
      assert.ok(body.hasOwnProperty(param), param + " field required!");
  }
}

function getOptionalRequestParams(optionalParams, locationObj, body){
    for(param of optionalParams){
      if(body.hasOwnProperty(param))
        locationObj[param] = body[param];
    }
    return locationObj;
}

module.exports = router;
