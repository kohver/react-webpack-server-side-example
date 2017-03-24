import React from 'react';
import ReactDOM from 'react-dom';
import Application from './Application/Application';

setTimeout(function () {
    ReactDOM.render(
		<Application
			url={location.pathname + (location.search || '')}
		/>,
		document.getElementById('root')
	);
}, 500);
