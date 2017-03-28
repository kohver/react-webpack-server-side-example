const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const evaluate = require('eval');
const bodyParser = require('body-parser');
const compression = require('compression');
const { publicPath, publicFolderName, generatedFolderName } = require('./paths.js');
const config = require('./webpack.config.js');

class PageNotFoundError extends Error {}
const wrapArray = mayBeArray => Array.isArray(mayBeArray) ? mayBeArray : mayBeArray ? [mayBeArray] : [];
const app = express();

if (!process.env.NODE_ENV) {
    throw new Error('Please specify NODE_ENV');
}
if (!process.env.PORT) {
    process.env.PORT = 3000;
    // throw new Error('Please specify PORT');
}

console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
console.log('process.env.PORT: ' + process.env.PORT);

if (process.env.NODE_ENV === 'development') {
    app.use(webpackMiddleware(webpack(config), {
        // full list https://github.com/webpack/webpack-dev-middleware#usage
        stats: { colors: true },
        publicPath: publicPath,
        serverSideRender: true,
    }));
}

// gzip
app.use(compression());
// for post params parsing
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
// static files
app.use(express.static(path.join(__dirname, publicFolderName)));

// remove trailing slash to avoid duplicate content
app.use((req, res, next) => {
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});

app.get('/', (req, res, next) => {
    req.url = '/index';
    next();
});

app.get('/:page*', (req, res) => {
    let assetsByChunkName;
    let page;
    const pageName = req.params.page;

    if (res.locals.webpackStats) {
        const webpackStats = res.locals.webpackStats;
        const json = res.locals.webpackStats.toJson();
        assetsByChunkName = {
            client: json.children[0].assetsByChunkName,
            server: json.children[1].assetsByChunkName,
        };
        const pageAssets = wrapArray(assetsByChunkName.server[pageName]);
        const pageJsAssetName = pageAssets.filter(pageAsset => pageAsset.endsWith('.js'))[0];

        if (!pageJsAssetName) {
            throw new PageNotFoundError(`Page '${pageName}' not found`);
        }

        const asset = webpackStats.stats[1].compilation.assets[pageJsAssetName];
        page = evaluate(asset.source(), null, {}, true).default;
    } else {
        assetsByChunkName = {
            client: require(`./${generatedFolderName}/stats.client.json`).assetsByChunkName,
            server: require(`./${generatedFolderName}/stats.server.json`).assetsByChunkName,
        };

        if (!require('fs').existsSync(`./${generatedFolderName}/${pageName}.js`)) {
            throw new PageNotFoundError(`Page '${pageName}' not found`);
        }

        page = require(`./${generatedFolderName}/${pageName}.js`).default;
    }

    if (typeof page !== 'function') {
        throw new Error(`Page ${pageName} must return a render function. Instead received: ${typeof page}`);
    }

    res.send(page(
        req,
        wrapArray(assetsByChunkName.client[pageName]),
        wrapArray(assetsByChunkName.server[pageName])
    ));
});

// error handler
// 'next' argument must be there, don't know why
app.use((err, req, res, next) => {
    if (err instanceof PageNotFoundError) {
        res.status(404).send(err.message);
    } else {
        console.error(err.stack);
        res.status(500).send(err.message);
    }
});

const server = app.listen(process.env.PORT, () => {
    console.log('Listening on port %d', server.address().port);
});
