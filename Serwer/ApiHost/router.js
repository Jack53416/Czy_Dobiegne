"use-strict"; 
var fs = require("fs");
var path = require("path");

var readDir = function (directory, filter, callback) {
    fs.readdir(directory, function (err, list) {
        if (err) {
            return callback(err);
        }
        var data = new Array();
        filter = "." + filter;
        for (var i = 0; i < list.length; i++) {
            if (path.extname(list[i]) === filter || filter === ".*")
                data.push(list[i]);
        }
        callback(null, data);
    });
};

var createRoutes = function (app) {
    readDir("./routes", "js", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        for (route of data) {
            var handler = require("./routes/" + route);
            var pth = "/" + path.basename(route, '.js');
            console.log("path " + pth);
            console.log("handler: " + "./routes/" + route);
            app.use(pth, handler);
        }

        app.get('*', function (req, res) {
            res.send("Invalid URL");
        });
    });
};

module.exports = createRoutes;