/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <html>
            <head>
                <title>
                    {this.props.title}
                </title>
                {this.props.cssFilename &&
                    <link href={'assets/' + this.props.cssFilename} rel="stylesheet" />
                }
            </head>
            <body>
                {this.props.children}

                {this.props.jsFilename &&
                    <script src={'assets/' + this.props.jsFilename}></script>
                }
            </body>
            </html>
        )
    }
});
