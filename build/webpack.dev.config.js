const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');
const devServer=require("./dev.server.js");
module.exports = merge(webpackBase,{
	mode: 'development',
	devtool:'inline-source-map',//
	devServer:{
		port:devServer.port,
		historyApiFallback:true,
		hot:true,
		progress:true,
		host:'127.0.0.1',
		proxy:devServer.proxy
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin()//HMR热模块替换，与chunkHash有冲突，因此chunkHash不能用于开发环境
	]
});