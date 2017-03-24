/** @jsx React.DOM */

var React = require('react');
var Application = require('./Application/Application');
var ServerPage = require('./ServerPage');

module.exports = function(req, jsFilename, cssFilename) {
    return React.renderComponentToStaticMarkup(
		<ServerPage
			title="About"
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
