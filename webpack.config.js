var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

var getEntriesInFolder = function(folder, extension) {
    return glob.sync(folder + '/*' + extension).reduce((entries, page) => {
        entries[path.basename(page, extension)] = page;
        return entries;
    }, {})
};

var commonLoaders = [
	{ test: /\.js$/, loader: 'jsx-loader' },
	{ test: /\.png$/, loader: 'url-loader' },
	{ test: /\.jpg$/, loader: 'file-loader' },
];
var assetsPath = path.join(__dirname, 'public', 'assets');
var publicPath = '/assets/';
var extractCSS = new ExtractTextPlugin('[name].[hash].css');

module.exports = [
	{
		// The configuration for the client
		name: 'browser',
		entry: getEntriesInFolder('./app', '.client.js'),
		output: {
			path: assetsPath,
			filename: '[name].[hash].js',
			publicPath: publicPath
		},
		module: {
            loaders: commonLoaders.concat([
                // todo duplicate styles
                { test: /\.css$/, loader: 'style-loader!css-loader' },
            ])
		},
        plugins: [
            new ManifestPlugin({
                fileName: '../../server/generated/client.assets.json'
            }),
            // This helps ensure the builds are consistent if source hasn't changed:
            new webpack.optimize.OccurrenceOrderPlugin(),
        ]
    },
	{
		// The configuration for the server-side rendering
		name: 'server-side rendering',
        entry: getEntriesInFolder('./app', '.server.js'),
		target: 'node',
		output: {
			path: assetsPath,
			filename: '../../server/generated/[name].js',
			publicPath: publicPath,
			libraryTarget: 'commonjs2'
		},
		externals: /^[a-z\-0-9]+$/,
		module: {
            loaders: commonLoaders.concat([
                {
                    test: /\.css$/,
                    loader: extractCSS.extract('style-loader', 'css-loader'),
                },
            ])
        },
        plugins: [
            extractCSS,
            new ManifestPlugin({
                fileName: '../../server/generated/server.assets.json'
            }),
            // This helps ensure the builds are consistent if source hasn't changed:
            new webpack.optimize.OccurrenceOrderPlugin(),
        ]
    }
];
