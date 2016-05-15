var express = require("express");
var logger = require("morgan");
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app){
	app.use(logger("dev"));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	//app.set("view options", {layout: false});
	app.set("views", "views");
  	app.engine('html', require('ejs').renderFile);
	app.use(express.static(path.join(__dirname,"../public"))); 

}