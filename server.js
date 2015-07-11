var express = require('express');
var app = express(); 

app.get('/', function(req, res) {
	res.send("HYPE");
});

app.listen(8080);
console.log("App listening on port 8080");