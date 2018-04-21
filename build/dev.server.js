module.exports = {
    //端口号
    port:3000,
    proxy:{
        //代理配置
        '/api/*': {
            target:'http://localhost:9001',            
            secure: true,
            changeOrigin: false
        }
    }
}