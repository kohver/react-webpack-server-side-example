/** @jsx React.DOM */

var React = require('react');
var Application = require('./Application');
var ServerPage = require('./ServerPage');

module.exports = function(req, jsFilename, cssFilename) {
	return React.renderComponentToStaticMarkup(
        <ServerPage
			title="Page"
			cssFilename={cssFilename}
			jsFilename={jsFilename}
		>
			<div id="root" dangerouslySetInnerHTML={{__html: React.renderComponentToString(
				<Application
					url={req.url}
				/>
            )}} />
		</ServerPage>
	);
}
