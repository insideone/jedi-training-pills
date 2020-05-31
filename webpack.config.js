const encore = require('@symfony/webpack-encore');
const WebpackUserscript = require('webpack-userscript');
const path = require('path');
const package = require('./package');

const isDevServer = encore.isDevServer();
const isDev = encore.isDev();
const dist = path.join(__dirname, 'dist');

const userscriptPlugin = new WebpackUserscript({
    headers: Object.assign(require('./src/headers'), {
        version: isDev ? `[version]-build.[buildTime]` : `[version]`
    }),
    proxyScript: {
        baseUrl: 'http://localhost:8080',
        filename: '[basename].proxy.user.js',
        enable: () => isDevServer,
    },
});

encore
    .setPublicPath('/')
    .setOutputPath(dist)
    .addEntry('jedi-training-pills', './src/index.ts')
    .disableSingleRuntimeChunk()
    .addPlugin(userscriptPlugin)
    .enableTypeScriptLoader()
    .configureDefinePlugin(options => {
        options['process.env'].VERSION = JSON.stringify(package.version);
    })
;

const config = encore.getWebpackConfig();

if  (encore.isDevServer()) {
    Object.assign(config.devServer, {
        injectClient: false,
        contentBase: dist,
        watchContentBase: true
    });
}

module.exports = config;
