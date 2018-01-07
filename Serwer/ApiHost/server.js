'use strict';
var express = require('express');
var helmet = require('helmet');
var router = require("./router.js");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var cors = require('cors');

const https = require('https');
const fs = require('fs');

var port = 8080;
const sslOptions = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
};

var swaggerDefinition = {
  info: {
    title: 'Czy_Dobiegne Api',
    version: '1.0.0',
    description: 'Basic Api for toilets in Poland',
  },
  host: '35.165.124.185',
  basePath: '/',
};
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js', './routes/api/*.js'],
};
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

var corsOptions = {
  origin: "*",
  exposedHeaders: "*",
  allowedHeaders: "*"
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
app.use(cors());

// serve swagger
app.get('/swagger', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', function (req, res) {
    res.render("index.ejs");
});

router(app);

app.listen(port);
https.createServer(sslOptions, app).listen(443);
