'use strict';
var express = require('express');
var mongoose = require('mongoose');
var validator = require('validator');
var UrlController = require('./app/controllers/urlController.js');

var app = express();
var urlController = new UrlController(validator);

require('dotenv').load();
app.use('/public', express.static('public'));

mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function() {
	console.log("Connected to database");
});

app.get("/", function(req, res) {
	res.sendFile(process.cwd() + '/views/index.htm');
});

app.get('/:shortUrl', urlController.getGotoUrl);
app.get('/new/*', urlController.getValidateUrl, urlController.getShortUrl);


var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Node.js is listening on port " + port + "...");
});