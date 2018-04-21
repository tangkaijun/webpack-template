const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelPolyfill = require('babel-polyfill');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackBaseConfig = {
	entry:{
		main:path.resolve(__dirname,'../src/entry/index.js')
	},
	devServer:{
		contentBase:'.',
	},
	plugins:[
	    new CleanWebpackPlugin([resolve ('dist')]),
	    new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../src/entry/index.html'),
            filename: 'index.html',
            inject:true,
            hash:false ,
            chunks:["common","main"]
        }),
	    new webpack.DefinePlugin({
	    	 'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
	    }),
	    new webpack.NamedModulesPlugin(),
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.optimize.OccurrenceOrderPlugin()
	],
	optimization:{
		splitChunks:{
			name:'common',
			filename:'[name]-[hash].js'
		}
	},
	output:{
		filename:'[name]-[hash].js',
		path:resolve ('dist')//,
		//publicPath:ASSET_PATH
	},
	resolve:{
	        extensions: ['.js','jsx','less','.vue', '.json'],
	        alias: {
		      '@': resolve('src'),
		      'modules':resolve('node_modules')
		    }
	},
	module:{
		rules:[
			{
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
                include:[resolve('src'),resolve('node_modules')]
			},
			{
				test: /(\.js)|(\.jsx)$/,
                use: {
                    loader: "babel-loader"
                },
                include:[resolve('src'),resolve('node_modules')]
			},
			{
				test: /\.(less)$/,
                use: ExtractTextPlugin.extract({
                     fallback: "style-loader",
                     use: "css-loader"
                }),
                include:[resolve('src'),resolve('node_modules')]
			},
			{
				test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name:"[path]-[name].[ext]",
                            outputPath:"imgs"
                        }
                    }
                ]
			},
			{test: /\.TTF$/, loader: 'file?name=fonts/[name].[ext]'},
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml'}
		]
	}
};

module.exports=webpackBaseConfig;