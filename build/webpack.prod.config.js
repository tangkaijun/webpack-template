const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config.js');

module.exports = merge(webpackBase,{
	mode: 'production',
	devtool:'source-map',
	plugins:[
		
	],
	optimization:{
		runtimeChunk: {
			name: 'manifest'
		},
		splitChunks:{
			name:'common',
			filename:'[name]-[chunkHash].js',
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
	}
});