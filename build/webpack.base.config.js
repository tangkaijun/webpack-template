const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelPolyfill = require('babel-polyfill');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const node_env = process.env.NODE_NEV

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
	    new CopyWebpackPlugin([{ from: 'src/assets/images/**', to: 'dist/images/'}],{ debug: 'info' }),
        new ExtractTextPlugin({filename:'style.css',allChunks: true}),
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
        new webpack.optimize.ModuleConcatenationPlugin() //webpack3之前打包，将各个模块打包到单独的闭包中，js执行速度慢，webpack3中提出的新特性提升作用域，将所有模块预编译打包到一个闭包中，提高浏览器执行js速度
	],
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