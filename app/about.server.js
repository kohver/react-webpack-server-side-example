import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Application from './Application/Application';
import ServerPage from './ServerPage';

export default function(req, jsFilename, cssFilename) {
    return ReactDOMServer.renderToStaticMarkup(
		<ServerPage
			title="About"
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
