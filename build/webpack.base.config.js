const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelPolyfill = require('babel-polyfill');
const CopyWebpackPlugin = require('copy-webpack-plugin');//拷贝资源
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");//优化压缩的css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//压缩css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");//压缩js
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');


const ASSET_PATH = process.env.ASSET_PATH || '/';

const devMode = process.env.NODE_ENV !== 'production'
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackBaseConfig = {
	entry:{
		app:path.resolve(__dirname,'../src/entry/index.js')
	},
	devServer:{
		contentBase:'.',
	},
	plugins:[
        new MiniCssExtractPlugin({
            filename: devMode?'[name]-[hash:8].css':'[name].[chunkhHash:8].css',
            chunkFilename: devMode?'[name]-[hash:8].css':'[id].[chunkHash:8].css',
          }),
	    new CopyWebpackPlugin([{ from: 'src/assets/images/**', to: 'dist/images/'}],{ debug: 'info' }),
        new CleanWebpackPlugin(['dist'],{root:process.cwd()}),
        //HtmlWebpackPlugin插件用于创建一个html文件，将打包好的各种如js、css模块引用进去
	    new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../src/entry/index.html'),//指定将创建的html所使用的模板
            filename: 'index.html',//指定生成的html文件名（可以带目录）
            favicon:null,//添加特定的favicon路径输出到HTML文件中
            title:'测试页',//生成页面title元素
            cache:true,//如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件
            inject:true,// 'head'|'body'|false,注入所有的资源到特定的template或者templateContent中，如果设置为true或者body，所有的javascript资源将被放置到body元素的底部，'head'将放置到head元素中
            chunksSortMode:'dependency',//允许控制块在添加到页面之前的排序方式，支持的值：'none' | 'default' | {function}-default:'auto'
            hash:false ,//如果是true，会给所有包含的script和css添加一个唯一的webpack编译hash值。这对于缓存清除非常有用
            excludeChunks:[]//允许跳过某些块，(比如，跳过单元测试的块) 
        }),
	    new webpack.DefinePlugin({
	    	 'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
	    }),
	    new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(), //webpack3之前打包，将各个模块打包到单独的闭包中，js执行速度慢，webpack3中提出的新特性提升作用域，将所有模块预编译打包到一个闭包中，提高浏览器执行js速度
        new ProgressBarPlugin({
            format:  chalk.yellow('build '+process.env.NODE_ENV)+chalk.red('[:bar]')+ chalk.green.bold(':percent') + ' (:elapsed seconds)',
            width:'600',
            complete:">",
            incomplete:"=",
        }),
        new webpack.DllReferencePlugin({// 描述 reacht动态模块的清单文件
            manifest: resolve('dll/react.manifest.json')
        }),
        new AddAssetHtmlPlugin({
            filepath: resolve("dll/react.dll.js"),
            hash: true
        }),
    ],
    output:{
		filename:devMode?'[name]-[hash:8].js':'[name]-[chunkHash:8].js',
        path:resolve ('dist'),
        publicPath: ASSET_PATH,
	},
    optimization:{
		runtimeChunk: {
            name: 'manifest'
        },
		splitChunks:{
			name:true,
			chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 0, // 最小尺寸，默认0
            minChunks: 2, // 最小 chunk ，默认1
            maxAsyncRequests: 1, // 最大异步请求数， 默认1
            maxInitialRequests: 1, // 最大初始化请求书，默认1
            cacheGroups: { // 这里开始设置缓存的 chunks
            	default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {//创建一个vendors块，其中包括node_modules整个应用程序中的所有代码。
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },   
                'async-vendors': {// 处理异步chunk 
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'async',
                    name: 'async-vendors'
                },
                styles: {
                    chunks: 'all',
                    name: 'styles',
                    enforce: true,
                    test: /.(css|scss|less)/
                }
            }
		},
		minimizer: [
      new UglifyJsPlugin({
             cache: true,
             parallel: true,
             sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
                canPrint: true
			})
     ]
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                devMode?'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
               // 'postcss-loader',
               // 'sass-loader',
                ]
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