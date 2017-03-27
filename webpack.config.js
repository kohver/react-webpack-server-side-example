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
    {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'app'),
        options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            presets: ['react', ['es2015', {modules: false}]],
            plugins: [
                'syntax-dynamic-import',
            ],
        }
    },
    {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
        },
    },
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
            rules: commonLoaders.concat([
                // todo duplicate styles
                { test: /\.css$/, loader: 'style-loader!css-loader' },
            ])
		},
        plugins: [
            new ManifestPlugin({
                fileName: '../../server/generated/client.assets.json'
            }),
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
            rules: commonLoaders.concat([
                {
                    test: /\.css$/,
                    loader: extractCSS.extract({ fallback: 'style-loader', use: 'css-loader' }),
                },
            ])
        },
        plugins: [
            extractCSS,
            new ManifestPlugin({
                fileName: '../../server/generated/server.assets.json'
            }),
        ]
    }
];
