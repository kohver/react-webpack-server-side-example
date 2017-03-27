import React from 'react';
import Application from './Application/Application';
import ReactDOMServer from 'react-dom/server';
import { ServerPage } from './ServerPage';

export default (req, clientAssets = [], serverAssets = []) => {
    return ReactDOMServer.renderToStaticMarkup(
		<ServerPage
			title="Page"
			cssFilenames={serverAssets.filter(asset => asset.endsWith('.css'))}
			jsFilenames={clientAssets.filter(asset => asset.endsWith('.js'))}
		>
			<div id="root" dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToString(
				<Application
					url={req.url}
				/>
            )}} />
		</ServerPage>
	);
}
