var helpers = require('./helpers.js');
var assert = require('assert');
var firebird = require('node-firebird');
var async = require('async');

var dbOptions = helpers.readJSONFile('fb-config.json');

/**
 * Creates new instance of userData object
 * @param  {string} username  username
 * @param  {string} email     valid email address
 * @param  {string} password  not encrypted password
 * @constructor
 */
function UserData(username, email, password){
  this.username = typeof username  !== 'undefined' ?  username  : '';
  this.email = typeof email !== 'undefined' ? email : '';
  this.password = typeof password !== 'undefined' ? password  : '';
  this.salt = helpers.generateSalt();
  this.encryptPassword();
}

UserData.prototype.encryptPassword = function(){
  this.passwordEncrypted =  helpers.hashData('sha256', this.password + this.salt, 'base64');
}

/**
 * Creates new instance of location object
 * @param       {string} country     coutry name, required
 * @param       {string} city        city name, required
 * @param       {string} street      full street address, required
 * @param       {number} longitude   latitude value, required
 * @param       {number} latitude    longitude value, required
 * @param       {string} name        name of the location, optional
 * @param       {number} price_min   minimal price, optional
 * @param       {number} price_max   maximal price, optional
 * @param       {string} description location's description, optional
 * @constructor
 */
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


/**
 * Creates new instance of QueryOptions object
 * @param   {Int}      count  specifies max quantity of records(max 200)
 * @param   {Int}      offset specifies offset of the requested records (0 - n)
 * @param   {string}   fields specifies fields for the request(ex.id,name.. ), all(*)
 * @param   {string}   whereString where string with ? marks as parameters
 * @param   {string}   whereParams parameters for where string
 * @constructor
 */
function QueryOptions(count, offset, fields, whereString, whereParams){
  this.count = count;
  this.offset = offset;
  this.fields = helpers.escapeColumnNames(fields);
  whereString === undefined ? this.whereString = "" : this.whereString = " WHERE " + whereString;
  whereParams === undefined ? this.whereParams = [] : this.whereParams = whereParams;
}

/**
 * Returns simple query string of pattern Select First {count} Skip {offset} from {tableName} Where {whereString}{whereParams}
 * @param  {string} tableName name of the table to query
 * @return {string}           query string
 */
QueryOptions.prototype.getSimpleQuery = function(tableName){
  return "SELECT FIRST " + this.count + " SKIP " + this.offset + " " +
                 this.fields + " FROM " + tableName + this.whereString;
}

/**
 * Returns query string for count operation on specified table and where clause
 * @param  {string} tableName name of the table to query
 * @return {string}           query string
 */
QueryOptions.prototype.getCountQuery = function(tableName){
  return "SELECT COUNT(*) FROM " + tableName + this.whereString;
}

/**
 * adds user to the databsae based od userData
 * @param {UserData} userData userData object, contains(username, email, password, passwordEncrypted, salt)
 * @param {Function} callback callback function called after completion
 */
function addUser(userData, callback){
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    var sqlQuery = "INSERT INTO USERS(USERNAME, EMAIL, PASSWORD, SALT, PERMISSIONS) VALUES\
                    (?, ?, ?, ?, 'regularUser')";
    db.query(sqlQuery, [userData.username, userData.email, userData.passwordEncrypted, userData.salt], function(err, QueryResult){
      db.detach();
      if(err){
        return callback(err);
      }
      callback();
    });

  });
}

/**
 * finds if user with given username or email exists in database and stores found userData in res.locals.userData
 * @param  {string}   username username or email
 * @param  {object}   res      response express object
 * @param  {Function} callback expess next callback
 * @return {Function}          callback invocation
 */
function findUser(username, res, callback){
    assert.equal(typeof(username), 'string',
        "argument must be string!");
    assert.ok(username.length <= 40, "username too long!");

    firebird.attach(dbOptions, function(err, db){
      if(err){
        throw err;
      }
      db.query("SELECT ID, USERNAME, EMAIL, PASSWORD, SALT, PERMISSIONS FROM USERS WHERE USERNAME = ? OR EMAIL = ?",
               [username, username], function(err, queryResult){
                db.detach();
                if(err){
                  return callback(err);
                }
                console.log(queryResult);
                if(queryResult.length === 0){
                  return callback(new Error("Invalid User!"));
                }
                res.locals.userData = queryResult[0];
                return callback();
              });
    });
}

/**
 * Finds user data object based on specified id
 * @param  {Int}   id   user id, usually obtained from token
 * @param  {object}   res  response express object
 * @param  {Function} next next express function callback
 * @return {Function}      callback invocation
 */
function findUserById(id, res, next){
  assert.ok(Number.isInteger(id), "argument must be integer!");

  firebird.attach(dbOptions, function(err, db){
    if(err)
      throw err;

    db.query("SELECT ID, USERNAME, EMAIL, PASSWORD, SALT, PERMISSIONS FROM USERS WHERE ID = ?",
              [id], function(err, queryResult){
                db.detach();
                if(err){
                  return next(err);
                }
                res.locals.userData = queryResult[0];
                return next();
              });
  });
}

/**
 * Deletes user from the databese based on specified id
 * @param  {Int}     id    user id, usually obtained from token
 * @param  {Functio} next  express next function callback
 * @return {Function}      callback invocation
 */
function deleteUser(id, next){
  firebird.attach(dbOptions, function(err, db){
    if(err)
      throw err;
      var sqlQuery = "DELETE FROM USERS WHERE ID = ?";
      db.query(sqlQuery, [id], function(err, result){
        db.detach();
        if(err)
          return next(err);
        return next();
      });
  });
}

/**
 * Updates user in the database based on id
 * @param  {UserData} userData userData object
 * @param  {Int}      id       user id
 * @param  {Function} next     express callback funciton
 * @return {Function}          callback invocation
 */
function updateUser(userData, id, next){
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    var sqlQuery = "UPDATE USERS\
                    SET USERNAME = ?, EMAIL = ?, PASSWORD = ?\
                    WHERE USERS.ID = " + firebird.escape(id);
  console.log(sqlQuery);
   db.query(sqlQuery,
            [userData.username, userData.email, userData.passwordEncrypted],
            function(err, queryResult){
              db.detach();
              if(err){
                return next(err);
              }
              return next();
            });
  });
}

/**
 * Gets given number of locations with a given ofsset and specified fields
 * @param  {QueryOptions} queryOptions   QueryOptions object
 * @param  {res}          res            response express object
 * @param  {Function}     next           express callback
 * @return {Function}                    invocation of the provided callback
 */

function getLocations(queryOptions, res, next){
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    async.parallel([
      function(callback){
        var sqlQuery = queryOptions.getCountQuery('TOILET_VIEW');
        db.query(sqlQuery, queryOptions.whereParams, function(err, queryResult){
          if(err)
            return callback(err);
          callback(null, queryResult);
        });
      },
      function(callback){
        var sqlQuery = queryOptions.getSimpleQuery('TOILET_VIEW');
        db.query(sqlQuery, queryOptions.whereParams, function(err, queryResult){
          if(err){
            return callback(err);
          }
          callback(null, queryResult);
        });
      }
    ],
      function(err, result){
        db.detach();
        if(err)
          return next(err);
        res.locals.queryResult = {
          "count": result[1].length ,
          "offset": queryOptions.offset,
          "total": result[0][0].count,
          "data": result[1]
        };
        return next();
    });
  });
}

/**
 * Adds new location to the database
 * @param {Location} location Location object
 * @param {object}   res      response express object
 * @param {Function} next     express callback function
 */
function addLocation(location, res, next){
  console.log(location);
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    var sqlQuery = "EXECUTE PROCEDURE ADD_TOILET (?,?,?,?,?,?,?,?,?)";
    var sqlQuertParams = [location.name, location.country, location.city, location.street, location.latitude, location.longitude,
                          location.price_min, location.price_max, location.description];
    db.query(sqlQuery, sqlQuertParams, function(err, queryResult){
      db.detach();
      if(err){
        return next(err);
      }
      res.locals.queryResult = queryResult;
      return next();
    });
  });
}

/**
 * Updates location based on location id inside location object
 * @param  {Location} location Location object
 * @param  {object}   res      response express object
 * @param  {Function} next     express callback function
 * @return {Function}            callback invocation
 */

function updateLocation(location, res, next){
  firebird.attach(dbOptions, function(err, db){
    if(err){
      throw err;
    }
    async.parallel([
      function(callback){
        var sqlQuery = "EXECUTE PROCEDURE UPDATE_LOCATION(?,?,?,?,?,?,?)";
        var sqlQueryParams = [location.id, location.name, location.country, location.city, location.street, location.longitude, location.latitude];
        db.query(sqlQuery, sqlQueryParams, function(err, queryResult){
          db.detach();
          if(err){
            return callback(err);
          }
          return callback(null, queryResult);
        });
      },
      function(callback){
        var sqlQuery = "UPDATE TOILETS SET PRICE_MIN = ?, PRICE_MAX = ?, DESCRIPTION = ? WHERE ID = ?";
        var sqlQueryParams = [location.price_min, location.price_max, location.description, location.id];
        db.query(sqlQuery, sqlQueryParams, function(err, queryResult){
          db.detach();
          if(err){
            return callback(err);
          }
          return callback(null, queryResult);
        });
      }
    ], function(err, results){
      res.locals.queryResult = results;
      return next();
    });
  });
}

exports.dbOptions = dbOptions;
exports.UserData = UserData;
exports.Location = Location;
exports.QueryOptions = QueryOptions;
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.findUser = findUser;
exports.findUserById = findUserById;
exports.updateUser = updateUser;
exports.getLocations = getLocations;
exports.addLocation = addLocation;
exports.updateLocation = updateLocation;
