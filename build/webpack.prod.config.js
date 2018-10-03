require('babel-polyfill');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(webpackBase,{
	mode: 'production',
	devtool:'source-map',
	output:{
		filename: 'bundles/[name].[chunkHash:8].js',
		path:path.resolve(__dirname,"../dist"),
        publicPath: './',
        chunkFilename: 'bundles/[name].bundle.js'
	},
	plugins:[
		new BundleAnalyzerPlugin()
	]
});