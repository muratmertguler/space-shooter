var express = require('express');

var app = express();
app.use('/static', express.static('static'));

var port = 8080;
app.listen(port, function () {
	console.log('App listening.')
});