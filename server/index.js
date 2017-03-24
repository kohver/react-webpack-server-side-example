var express = require("express");
var path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

var stats = require("./generated/stats.json");

app.get("/", function(req, res) {
    var page = require("./generated/about.js");
	res.end(page(req, stats.assetsByChunkName.about));
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
