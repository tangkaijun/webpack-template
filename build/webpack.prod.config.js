const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(webpackBase,{
	mode: 'production',
	devtool:'source-map',
	optimization: {
	  minimizer: [
	    new UglifyJsPlugin({
	      uglifyOptions: {
	        compress: {
	          drop_console: true
	        },
	        output: {
	          comments: false
	        }
	      },
	    }),
	  ],
	},
	plugins:[
		new webpack.optimize.ModuleConcatenationPlugin()
	]
});