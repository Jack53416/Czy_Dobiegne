var helpers = require('./helpers');
var jwt = require('jsonwebtoken');
var assert = require('assert');

var secretTokenKey = helpers.generateSalt();
const tokenExpireTime = 300;

/**
 * Instantiate TokenPayload object
 * @param       {Int} userId      id of the user receiving the token
 * @param       {string} permissions permissions of the user receiving the token
 * @constructor
 */
function TokenPayload(userId, permissions){
  this.userId = userId;
  this.permissions = permissions;
}

/**
 * Generates Json token for a given payload
 * @param  {TokenPayload} tokenPayload TokenPayload object
 * @return {string}             token
 */
TokenPayload.prototype.getToken = () =>
  jwt.sign({"userId" : this.userId, "permissions": this.permissions}, secretTokenKey, {"expiresIn" : tokenExpireTime});


/**
 * Express function, verifies validity of a token given in req express object
 * @param  {req}   req  express request object
 * @param  {res}   res  express response object
 * @param  {Function} next callback called after completion
 */
function verifyToken(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  assert.ok(token, "No token provided, access denied!");
  jwt.verify(token, secretTokenKey, function(err, decoded){
    if(err){
      return next(new Error("Invalid or timed out token"));
    }
    req.decoded = decoded;
    return next();
  });
}

/**
 * checks if requestPassword is valid for a given userData
 * @param  {UserData} userData       userData object based on data from database
 * @param  {string} requestPassword  password to be checked
 * @return {boolean}                 returns true if credetials are valid, false in other case
 */
function checkCredentials(userData, requestPassword){
  var encryptedFromRequest = helpers.hashData('sha256',
                             requestPassword + userData.salt,
                             'base64');

  if(userData.password === encryptedFromRequest ){
    return true;
  }
  return false;
}

exports.TokenPayload = TokenPayload;
exports.checkCredentials = checkCredentials;
exports.verifyToken = verifyToken;
