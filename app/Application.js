/** @jsx React.DOM */

var React = require('react');
require('./Application.css');

var Application = React.createClass({
	getInitialState: function() {
		return {
			from: 'server',
            lazyComponent: '...',
		};
	},

	render: function() {
		return (
			<div className="application">
				<h1>Hello World</h1>
				<pre>{this.props.url}</pre>
				<img src={require('./image.png')} height="100" />
				<img src={require('./image.jpg')} height="100" />
				{this.state.from}
				{this.state.lazyComponent}
			</div>
		);
	},

	componentDidMount: function() {
		var t = this;

		this.setState({
			from: 'client',
		});

		require.ensure([], function() {
			var Lazy = require('./Lazy');

			t.setState({
				lazyComponent: <Lazy />,
			});
		});
    }
});

module.exports = Application;
