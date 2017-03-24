import React from 'react';
import './Application.css';

export default React.createClass({
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
				<img src={require('../image.png')} height="100" />
				<img src={require('../image.jpg')} height="100" />
				{this.state.from}
				{this.state.lazyComponent}
			</div>
		);
	},

	componentDidMount: function() {
		this.setState({
			from: 'client',
		});

		import('../Lazy/Lazy').then(module => {
		    const Lazy = module.default;

			this.setState({
				lazyComponent: <Lazy />,
			});
        });
    }
});
