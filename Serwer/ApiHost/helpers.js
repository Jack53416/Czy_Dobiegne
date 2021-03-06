"use strict"
var fs = require("fs");
var crypto = require('crypto');
var path = require('path');
var assert = require('assert');
var validator = require('validator');

class InvalidRequestError extends Error{
  constructor(...args){
    super(...args);
    this.code = 400;
    Error.captureStackTrace(this, UnauthorizedAccessError);
  }
}

class UnauthorizedAccessError extends Error{
  constructor(...args){
    super(...args);
    this.code = 401;
    Error.captureStackTrace(this, UnauthorizedAccessError);
  }
}

class ForbiddenAccessError extends Error{
  constructor(...args){
    super(...args);
    this.code = 403;
    Error.captureStackTrace(this, ForbiddenAccessError);
  }
}

class SqlError extends Error{
  constructor(...args){
    super(...args);
    this.code = 501;
    Error.captureStackTrace(this, ForbiddenAccessError);
  }
}
class ErrorResponse{
  constructor(error, isStackTraced){
    this.success = false;
    this.errorType = error.constructor.name;
    this.message = error.message;
    if(isStackTraced)
      this.stackTrace = error.stack.split('\n')
    }
}

const readDirectorySync = (dir, usrFilter) =>
 fs.readdirSync(dir)
    .reduce((files, file) =>
    {
        var filepath = dir + '/' + file;
        if(fs.statSync(filepath).isDirectory())
          return files.concat(readDirectorySync(filepath))
        else
          return files.concat(filepath);

    }, [])
    .filter((element) => {
      var extension = path.extname(element);
      return usrFilter === undefined || extension === usrFilter;
    });

var readJSONFile = function (fileName) {
    if (!fs.existsSync(fileName)) {
        console.log("unable to open file: " + fileName);
        throw new Error("unable to open file: " + fileName);
    }
    var data = fs.readFileSync(fileName, { encoding: 'utf8' });
    console.log(data);
    var object = JSON.parse(data);
    return object;
}


var hashData = function (algorithm, input, encoding){
  var hash = crypto.createHash(algorithm);
  return hash.update(new Buffer(input)).digest(encoding);
}

var generateSalt = function(){
  return crypto.randomBytes(16).toString('base64');
}


function escapeColumnNames(inputString){
  return inputString.toUpperCase().split(',').map(function(column){
    if(column !== '*')
      return '\"' + column + '\"';
    else
      return column;
  }).join(',');
}


function validateStandardQuery(query){
  var count = 200;
  var offset = 0;
  var fields = "";

  assert.ok(query.hasOwnProperty('fields'), 'No fields property');
  assert.ok(query.fields.length > 0, 'No fields specified');

  fields = query.fields;

  if(query.hasOwnProperty('count')){
     assert.ok(validator.isInt(query.count, {"min":1, "max": 200}), 'count should be a value between 1 and 200');
     count = parseInt(query.count);
  }

  if(query.hasOwnProperty('offset')){
    assert.ok(validator.isInt(query.offset, {"min":0}), 'offset is invalid');
    offset = parseInt(query.offset);
  }
  return {count: count, offset: offset, fields : fields};

}

exports.readJSONFile = readJSONFile;
exports.hashData = hashData;
exports.generateSalt = generateSalt;
exports.escapeColumnNames = escapeColumnNames;
exports.readDirectorySync = readDirectorySync;
exports.validateStandardQuery = validateStandardQuery;
exports.InvalidRequestError = InvalidRequestError;
exports.UnauthorizedAccessError = UnauthorizedAccessError;
exports.ForbiddenAccessError = ForbiddenAccessError;
exports.SqlError = SqlError;
exports.ErrorResponse = ErrorResponse;
