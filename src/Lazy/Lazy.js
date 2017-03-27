import React from 'react';
require('./Lazy.css');

export default React.createClass({
    render: function() {
        return (
            <div className="lazy">
                Lazy loaded
                <img src={require('../image.jpg')} height="100" />
            </div>
        );
    },
});
