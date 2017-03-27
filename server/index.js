const express = require('express');
const path = require('path');
const serverAssets = require('./generated/server.assets.json');
const clientAssets = require('./generated/client.assets.json');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/:page', function(req, res) {
    const page = require('./generated/' + req.params.page + '.js').default;

	res.end(page(
	    req,
        clientAssets[req.params.page + '.js'],
        serverAssets[req.params.page + '.css']
    ));
});

const server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
