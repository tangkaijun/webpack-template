const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelPolyfill = require('babel-polyfill');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackBaseConfig = {
	entry:{
		main:path.resolve(__dirname,'../src/entry/index.js'),
		common:['lodash']  //配置公共模块
	},
	devServer:{
		contentBase:'.',
	},
	plugins:[
	    new CopyWebpackPlugin([{ from: 'src/assets/images/**', to: 'dist/images/'}],{ debug: 'info' }),
	    new ExtractTextPlugin({filename:'style.css',allChunks: true}),
	    new CleanWebpackPlugin([resolve('dist')]),
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
			filename:'[name]-[hash].js',
			chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 0, // 最小尺寸，默认0
            minChunks: 1, // 最小 chunk ，默认1
            maxAsyncRequests: 1, // 最大异步请求数， 默认1
            maxInitialRequests: 1, // 最大初始化请求书，默认1
            cacheGroups: { // 这里开始设置缓存的 chunks
            	default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                priority:"0", // 缓存组优先级
                vendor: { // key 为entry中定义的 入口名称
                    chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: "vendor", // 要缓存的 分隔出来的 chunk 名称
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 1, // 最大异步请求数， 默认1
                    maxInitialRequests: 1, // 最大初始化请求书，默认1
                    reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
                },
                commons: {  //打包第三方类库
                    name: "commons",
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
		}
	},
	output:{
		filename:'[name]-[hash].js',
		path:resolve ('dist'),
        publicPath:ASSET_PATH
	},
	resolve:{
	        extensions: ['.js','.less', '.json'],
	        alias: {
		      '@': resolve('src'),
		      'modules':resolve('node_modules')
		    }
	},
	module:{
		rules:[
			{
				test: /(\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
			},
			{
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
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