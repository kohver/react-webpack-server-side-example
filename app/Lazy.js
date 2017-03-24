/** @jsx React.DOM */

var React = require('react');
require('./Lazy.css');

var Lazy = React.createClass({
    render: function() {
        return (
            <div className="lazy">
                Lazy loaded
                <img src={require('./image.jpg')} height="100" />
            </div>
        );
    },
});

module.exports = Lazy;
