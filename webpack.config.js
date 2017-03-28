const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const {
    srcFolderName,
    publicPath,
    assetsPath,
    generatedFolderName,
} = require('./paths.js');

const getEntriesInFolder = function(folder, extension) {
    return glob.sync(folder + '/*' + extension).reduce((entries, page) => {
        entries[path.basename(page, extension)] = page;

        return entries;
    }, {});
};

const clientEntries = getEntriesInFolder('./' + srcFolderName, '.client.js');
const serverEntries = getEntriesInFolder('./' + srcFolderName, '.server.js');
const extractCSS = new ExtractTextPlugin('[name].[hash].css');

if (Object.keys(serverEntries).length === 0) {
    throw new Error('You should create at least one *.server.js file.');
}

if (Object.keys(clientEntries).length === 0) {
    throw new Error('You should create at least one *.client.js file.');
}

const commonLoaders = [{
    test: /\.js$/,
    loader: 'babel-loader',
    include: path.join(__dirname, srcFolderName),
    options: {
        // This is a feature of `babel-loader` for webpack (not Babel itself).
        // It enables caching results in ./node_modules/.cache/babel-loader/
        // directory for faster rebuilds.
        cacheDirectory: true,
        presets: ['react', ['es2015', {modules: false}]],
        plugins: [
            'syntax-dynamic-import',
            'transform-object-rest-spread',
            'transform-class-properties',
        ],
    },
}, {
    test: /\.(png|jpg|svg|woff|woff2|ttf|eot)$/,
    loader: 'url-loader',
    options: {
        limit: 1000,
    },
}];

module.exports = [{
    // The configuration for the client
    name: 'client',
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: 'cheap-module-source-map',
    entry: clientEntries,
    output: {
        path: assetsPath,
        filename: '[name].[hash].js',
        publicPath: publicPath,
    },
    module: {
        rules: commonLoaders.concat([
            // todo set up lazy loaded modules
            // it works but duplicates styles
            // { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.css$/, loader: 'null-loader' },
        ]),
    },
    plugins: [
        new StatsWriterPlugin({
            filename: `../../${generatedFolderName}/stats.client.json`,
        }),
    ],
}, {
    // The configuration for the server-side rendering
    name: 'server',
    entry: serverEntries,
    target: 'node',
    output: {
        path: assetsPath,
        filename: `../../${generatedFolderName}/[name].js`,
        publicPath: publicPath,
        libraryTarget: 'commonjs2',
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
        // todo avoid "lazy loaded" chunks for server (0.hash.js)
        // the LimitChunkCountPlugin should do this, but
        // I've commented it because it doesn't work.
        // Possibly it's a bug https://github.com/webpack/webpack/issues/4178
        // new webpack.optimize.LimitChunkCountPlugin({
        //     maxChunks: 0,
        // }),
        new StatsWriterPlugin({
            filename: `../../${generatedFolderName}/stats.server.json`,
        }),
    ],
}];
