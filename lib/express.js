'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var path = require('path');

app.use(express.static(path.join(__dirname, '../Angular')));

app.use(methodOverride());
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.disable('x-powered-by');

app.use(cors());
app.options('*', cors());

// Attach error handler here

module.exports = app;
