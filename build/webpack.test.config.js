const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');

module.exports = merge(webpackBase,{
	mode: 'testing',
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