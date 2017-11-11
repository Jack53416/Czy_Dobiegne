"use-strict";
var path = require("path");
var helpers = require("./helpers.js");

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

   app.get('*', function (req, res) {
       res.send("Invalid URL");
   });

 };

module.exports = createRoutes;
