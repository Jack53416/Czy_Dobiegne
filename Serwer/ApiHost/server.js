'use strict';
var express = require('express');
var helmet = require('helmet');
var router = require("./router.js");
var bodyParser = require('body-parser');
var morgan = require('morgan');
const https = require('https');
const fs = require('fs');

var port = 8080;
const sslOptions = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
};

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.set("views", "./views");
app.set("view-engine", "ejs");

app.use(express.static('public'));
app.use(express.static('Scripts'));

router(app);

app.get('/', function (req, res) {
    res.render("index.ejs");
});



//app.listen(port);
https.createServer(sslOptions, app).listen(443);
