"use-strict"

var express = require('express');
var router  = express.Router();
var assert = require('assert');
var helpers = require('../../helpers.js');
const { UnauthorizedAccessError } = require('../../helpers.js');
var authorize = require('../../authorize.js');
var database = require('../../database.js');

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
 *       401:
 *         description: authorization failure, wrong credentials
 *         schema:
 *           $ref: '#/definitions/ApiError'
 *       500:
 *         description: general server error, apart from general information, stack treace will be provided
 *         schema:
 *           $ref: '#/definitions/ApiError'
 */

router.post('/', function(req, res, next){
  assert.ok(req.body.hasOwnProperty('password'), 'no password given!');
  assert.ok(req.body.hasOwnProperty('username'), 'no username given!');
  database.findUser(req.body.username, res, next);

}, function(req, res, next){
  if(!authorize.checkCredentials(res.locals.userData, req.body.password)){
    return next(new UnauthorizedAccessError("Invalid password!"));
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

module.exports = router;
