'use strict';

var Url = require('../models/urls.js');

function UrlController(validator){

	// GET, Validate URL
	this.getValidateUrl = function(req, res, next) {
		var url = req._parsedUrl.path.substring(5); // from request object, substring to remove '/new/'
		if (validator.isURL(url,{require_protocol: true})) {
			next();
		} else {
			res.json({
				error: 'URL Invalid'
			});
		}

	}

	//GET, Shorten URL
	this.getShortUrl = function(req, res, next){
		Url.count({}, function(err, count){
			if(err){
				throw err;
			}
			var newCount = count + 1;  
			var url = new Url({
				original_url: req._parsedUrl.path.substring(5),
				short_url: req.protocol + "://" + req.hostname + '/' + newCount,

			});

			url.save(function(err) {
				if (err) {
					throw err;
				}
				return res.json({
					original_url: url.original_url,
					short_url: url.short_url
				});
			});


		});
	}

	// GET, GotoUrl
	this.getGotoUrl = function(req, res, next){
		var shortUrl =  req.protocol + "://" + req.hostname + req.originalUrl;
		Url.findOne({'short_url': shortUrl}, function(err, url){
			if(err){
				throw err;
			}
			if(!url){
				return res.json({
					'error' : 'Invalid URL'
				});
			}

			return res.redirect(url.original_url);

		});
	}
}

module.exports =  UrlController;