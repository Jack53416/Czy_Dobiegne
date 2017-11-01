"use strict";
var express = require('express');
var router = express.Router();
var fb = require('node-firebird');
var async = require("async");
var fs = require("fs");

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

var convertToJSON = function (dbObj) {
    var result = [];
    for (var row of dbObj) {
        result.push({
            "priceMin": row.PRICE_MIN,
            "priceMax": row.PRICE_MAX,
            "description": row.DESCRIPTION.toString("utf8"),
            "rating": row.RATING,
            "voteNr": row.VOTE_NR,
            "dateAdded": row.DATE_ADDED,
            "name": row.NAME.toString("utf8"),
            "city": row.CITY.toString("utf8"),
            "street": row.STREET.toString("utf8")
        });
    }

    return result;
}

router.get("/", function (req, res) {
    var responseSent = false;
    var options = readJSONFile("fb-config.json");
    console.log(options);
    fb.attach(options, function (err, db) {
        if (err) {
	    console.log("Connection error: " + err);
            if (!responseSent) {
                res.json(err).end();
                responseSent = true;
            }
        }
        else {
            db.query("SELECT * FROM TOILET_VIEW", function (err, result) {
		if(err){
			console.log(err);
		}
		console.log("result" + JSON.stringify(convertToJSON(result)));
                res.status(200).json(result);
            });
        }

    });
});


module.exports = router;
