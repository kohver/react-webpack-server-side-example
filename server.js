const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const wrapArray = strOrArray => typeof strOrArray === 'string' ? [strOrArray] : strOrArray;
const app = express();
const evaluate = require('eval');
import { publicPath } from './webpack.config';

console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    app.use(webpackMiddleware(webpack(config), {
        // full list https://github.com/webpack/webpack-dev-middleware#usage
        stats: {
            colors: true
        },
        publicPath: publicPath,
        serverSideRender: true,
    }));
} else {
    app.use(express.static(path.join(__dirname, 'public')));
}

app.get('/:page', function(req, res) {
    let assetsByChunkName;
    let page;

    if (res.locals.webpackStats) {
        const webpackStats = res.locals.webpackStats;
        const json = res.locals.webpackStats.toJson();
        assetsByChunkName = {
            client: json.children[0].assetsByChunkName,
            server: json.children[1].assetsByChunkName,
        };
        const pageAssets = assetsByChunkName.server[req.params.page];
        const pageJsAssetName = pageAssets.filter(pageAsset => pageAsset.endsWith('.js'));
        const asset = webpackStats.stats[1].compilation.assets[pageJsAssetName];

        page = evaluate(asset.source(), pageJsAssetName, {}, true).default;
    } else {
        assetsByChunkName = {
            client: require('./.generated/stats.client.json').assetsByChunkName,
            server: require('./.generated/stats.server.json').assetsByChunkName,
        };
        page = require('./.generated/' + req.params.page + '.js').default;
    }

    validatePageModule(page);

    res.send(page(
        req,
        wrapArray(assetsByChunkName.client[req.params.page]),
        wrapArray(assetsByChunkName.server[req.params.page])
    ));
});

const validatePageModule = (pageModule, pageName) => {
    if (typeof pageModule !== 'function') {
        throw new Error(`Page ${pageName} must return a render function. Instead received: ${typeof pageModule}`);
    }
};

const server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
