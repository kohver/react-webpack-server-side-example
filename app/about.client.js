/** @jsx React.DOM */

var React = require('react');
var Application = require('./Application/Application');

setTimeout(function () {
	React.renderComponent(
		<Application
			url={location.pathname + (location.search || '')}
		/>,
		document.getElementById('root')
	);
}, 500);
