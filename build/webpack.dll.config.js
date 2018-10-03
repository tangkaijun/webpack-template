const path = require('path');
const webpack = require('webpack');

module.exports = {
  // JS 执行入口文件
  entry: {
    // 把 React 相关的放到一个单独的动态链接库
    react: ['react', 'react-dom']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, '../dll'),
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是lib_react_dll
    // 之所以在后面加上_dll 是为了防止全局变量冲突
    library: 'lib_[name]_dll',//注意：需要和DllPlugin的名称保持一致
  },
  plugins: [
    // 接入 DllPlugin
    new webpack.DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "lib_react.dll"
      name: 'lib_[name]_dll',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, '../dll', '[name].manifest.json'),
  	}),
	  new webpack.HashedModuleIdsPlugin({
		hashFunction:'md5',//sha256
		hashDigest:'base64',//hex
		hashDigestLength:4
	  })//该插件会根据模块的相对路径生成一个四位数的hash作为模块id，一般用于生产环境
  ],
};