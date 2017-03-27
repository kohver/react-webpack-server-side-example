const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

const getEntriesInFolder = function(folder, extension) {
    return glob.sync(folder + '/*' + extension).reduce((entries, page) => {
        entries[path.basename(page, extension)] = page;
        return entries;
    }, {})
};

const commonLoaders = [
    {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
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
const assetsPath = path.join(__dirname, 'public', 'assets');
const publicPath = '/assets/';
const srcPath = './src';
const extractCSS = new ExtractTextPlugin('[name].[hash].css');

module.exports = [
	{
		// The configuration for the client
		name: 'browser',
		entry: getEntriesInFolder(srcPath, '.client.js'),
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
            new StatsWriterPlugin({
                filename: '../../.generated/stats.client.json',
            }),
        ]
    },
	{
		// The configuration for the server-side rendering
		name: 'server-side rendering',
        entry: getEntriesInFolder(srcPath, '.server.js'),
		target: 'node',
		output: {
			path: assetsPath,
			filename: '../../.generated/[name].js',
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
            ]),
        },
        plugins: [
            extractCSS,
            // todo remove lazy load plugins for server (0.hash.js)
            // commented because possibly it's a bug https://github.com/webpack/webpack/issues/4178
            // new webpack.optimize.LimitChunkCountPlugin({
            //     maxChunks: 0,
            // }),
            new StatsWriterPlugin({
                filename: '../../.generated/stats.server.json',
            }),
        ],
    },
];
