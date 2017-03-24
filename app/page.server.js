import React from 'react';
import Application from './Application/Application';
var ReactDOMServer = require('react-dom/server');
var ServerPage = require('./ServerPage');

export default function(req, jsFilename, cssFilename) {
	return ReactDOMServer.renderToStaticMarkup(
        <ServerPage
			title="Page"
			cssFilename={cssFilename}
			jsFilename={jsFilename}
		>
			<div id="root" dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToString(
				<Application
					url={req.url}
				/>
            )}} />
		</ServerPage>
	);
}
