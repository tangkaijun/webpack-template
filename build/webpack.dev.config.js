const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');
const devServer=require("./dev.server.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(webpackBase,{
	mode: 'development',
	devtool:'cheap-module-eval-source-map',
	devServer:{
		port:devServer.port,
		historyApiFallback:true,
		hot:true,
		progress:true,
		host:'127.0.0.1',
		proxy:devServer.proxy
	}
});