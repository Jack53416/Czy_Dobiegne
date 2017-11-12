var helpers = require('./helpers.js');
var assert = require('assert');
var firebird = require('node-firebird');

var dbOptions = helpers.readJSONFile('fb-config.json');

/**
 * Creates new instance of userData object
 * @param  {string} username  username
 * @param  {string} email     valid email address
 * @param  {string} password  not encrypted password
 * @constructor
 */
function UserData(username, email, password){
  this.username = username;
  this.email = email;
  this.password = password;
  this.salt = helpers.generateSalt();
  this.passwordEncrypted = helpers.hashData('sha256', this.password + this.salt, 'base64');
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
                  callback(err);
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
     var sqlQuery = queryOptions.getSimpleQuery('TOILET_VIEW');
    console.log(sqlQuery);
    db.query(sqlQuery, queryOptions.whereParams, function(err, queryResult){
      db.detach();
      if(err){
        return next(err);
      }
      res.json({"count": queryResult.length , "offset": queryOptions.offset, "data": queryResult});
    });
  });
}

exports.dbOptions = dbOptions;
exports.UserData = UserData;
exports.QueryOptions = QueryOptions;
exports.addUser = addUser;
exports.findUser = findUser;
exports.updateUser = updateUser;
exports.getLocations = getLocations;
