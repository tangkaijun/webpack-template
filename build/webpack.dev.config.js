const webpack = require('webpack');
const merge = require('webpack-merge');
const portfinder = require('portfinder');
const webpackBase = require('./webpack.base.config.js');
const devServer=require("./dev.server.js");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const devWebpackConfig = merge(webpackBase,{
	mode: 'development',
	devtool:'inline-source-map',//
	devServer:{
		port:devServer.port,
		historyApiFallback:true,
		hot:true,
		progress:true,
		quiet: true,
		inline:true,
		host:'127.0.0.1',
		proxy:devServer.proxy
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin()//HMR热模块替换，与chunkHash有冲突，因此chunkHash不能用于开发环境
	]
});

module.exports = new Promise((resolve, reject) => {
	portfinder.basePort = process.env.PORT || devServer.port ;
	portfinder.getPort((err, port) => {
		if (err) {
		   reject(err)
		} else {
		// publish the new Port, necessary for e2e tests
		process.env.PORT = port
		// add port to devServer config
		devWebpackConfig.devServer.port = port
		// Add FriendlyErrorsPlugin
		devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
			log: true,
			compilationSuccessInfo: {
			     messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
			},
			onErrors: () => {
				const notifier = require('node-notifier')
				return (severity, errors) => {
					if (severity !== 'error') return
					const error = errors[0]
					const filename = error.file && error.file.split('!').pop()
					notifier.notify({
					title: packageConfig.name,
					message: severity + ': ' + error.name,
					subtitle: filename || '',
					icon: path.join(__dirname, 'logo.png')
					})
				}
			}
		}))
	     resolve(devWebpackConfig)
		}
	})
})