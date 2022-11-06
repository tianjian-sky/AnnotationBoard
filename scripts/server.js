const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.base.js');
const _config = webpackConfig(null, { mode: 'development' })
const compiler = Webpack(_config);
const devServerOptions = { ..._config.devServer, open: false };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();