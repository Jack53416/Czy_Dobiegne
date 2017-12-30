"use-strict";
var path = require("path");
var helpers = require("./helpers.js");
const { ErrorResponse, InvalidRequestError, SqlError, UnauthorizedAccessError, ForbiddenAccessError }
      = require('./helpers.js');
const { AssertionError } = require('assert');

var makeServerPath = (basePath, scriptPath) =>
  scriptPath.substring(basePath.length, scriptPath.length - '.js'.length);


var createRoutes = function (app) {
  var routeList = helpers.readDirectorySync('./routes', '.js')
   for (route of routeList) {
     var handler = require(route);
     var pth = makeServerPath('./routes', route);
     console.log("path: " + pth);
     console.log("handler: " + route);
     app.use(pth, handler);
   }
   app.use(apiErrorHandler);
   app.use(ErrorHandlerGeneric);

   app.get('*', function (req, res) {
       res.send("Invalid URL");
   });

 };

function apiErrorHandler(err, req, res, next){
  if(err instanceof AssertionError){
    return res.status(400).json(new ErrorResponse(err, false));
  }
  if(err instanceof UnauthorizedAccessError ||
     err instanceof SqlError ||
     err instanceof ForbiddenAccessError ||
     err instanceof InvalidRequestError){
       let errCode = err.code || 500;
       return res.status(errCode).json(new ErrorResponse(err, false));
  }
  next(err);
}
 function ErrorHandlerGeneric(err, req, res, next){
   res.status(500).json(new ErrorResponse(err, true));
  console.error(err);
 }

module.exports = createRoutes;
