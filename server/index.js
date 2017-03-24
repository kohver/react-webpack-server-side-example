var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

var serverAssets = require('./generated/server.assets.json');
var clientAssets = require('./generated/client.assets.json');

app.get('/:page', function(req, res) {
    var page = require('./generated/' + req.params.page + '.js');

	res.end(page(
	    req,
        clientAssets[req.params.page + '.js'],
        serverAssets[req.params.page + '.css']
    ));
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
