"use strict"
var fs = require("fs");
var crypto = require('crypto');


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

exports.readJSONFile = readJSONFile;
exports.hashData = hashData;
exports.generateSalt = generateSalt;
exports.escapeColumnNames = escapeColumnNames;
