const path = require('path');

module.exports = {
    generatedFolderName: '.generated',
    srcFolderName: 'src',
    publicFolderName: 'public',
    assetsPath: path.join(__dirname, 'public', 'assets'),
    publicPath: '/assets/',
};
