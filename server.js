var express = require("express");
var open = require("open");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var schema = require("./schema");
var port = process.env.PORT || 3000;
var connectDb = require('./connectdb');
var BASE_URL = process.env.PORT ? "https://url-shortener-0904.herokuapp.com/" : "http://localhost:3000";

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));//Log every request to the console

app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/:id',function(req,res) {
	schema.find({id: req.params.id}).exec(function(err,result) {
		if (result) {
			if(result.length === 0){
			res.json({
					"error":"The given URL does not exist."
				});
			}
			else if(result.length === 1){
				res.redirect(result[0].original_url);
			}	
		}			
	});
});

app.post('/new',function(req,res) {
	var url = req.query.url;
	var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
 	var regex = new RegExp(expression);
	var validUrl = url.match(regex);
	if(validUrl)
	{
		schema.find({original_url: url}).exec(function(err,result) {
			if(result.length === 0)
			{
				schema.findOne().sort('-id').exec(function(err1,result1){
					if(result1 === null)
						schema.create({
							id: 1,
							original_url: url
						},function(err2,result2) {
							if(!err2)
								res.json({
									"original_url":url,
									"short_url": BASE_URL + result2.id
								});
						});
					else {
						schema.create({
							id: result1.id + 1,
							original_url: url
						},function(err3,result3) {
							if(!err3)
								res.json({
									"original_url":url,
									"short_url": BASE_URL + (result1.id + 1)
								});
						});
					}
				});
			}
			else {
				res.json({
						"original_url":url,
						"short_url": BASE_URL + result[0].id
					});
			}

		});	
	}
	else {
		res.json({
		"error":"Wrong url format, make sure you have a valid protocol and real site."
		});
	}
});

app.listen(port,function() {
	var url = "http://localhost:"+port;
	console.log("MAGIC HAPPENING @ " + url);
	open(url);
});
