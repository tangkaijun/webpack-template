import axios from 'axios';

/**
 * http请求工具封装
 * @param {*} method get/post 
 * @param {*} url    请求的地址
 * @param {*} data   请求参数
 * @param {*} config 配置信息
 */
function httpAjax(method,url,data,config){

    let promise = new Promise((resolve,reject)=>{
        //请求拦截器
        axios.interceptors.request.use(function(config){
            //请求前作一些处理
            console.log("请求前处理......");
            return config;
        },function(error){
            return new Promise.reject(error);
        });

        //响应拦截器
        axios.interceptors.response.use(function (response) {
		    return response;
		  }, function (error) {
		    return Promise.reject(error);
		  });
        axios[method](url, data, config)
			.then(result => {
				const { status , data } = result;
				// 后台请求返回的status=200是操作成功
				if (200 === status) {
                    console.log("响应的数据是:",data);
					if(data.data&&(typeof data.data.accessToken=="string")){
				    	//cookieUtil.set('token',data.data.accessToken);
				    	//Local.set('verification',data.data.userId);
					}
				  	resolve(data);

				} else if(data.errno==-3){
					//Prompt['error']("token过期，请重新登录!",()=>{
						//cookieUtil.unset("token");
						//history.push("/login");
						//Local.remove('currentMenu');
						//Local.remove('currentKey');
					//})

				}else {
				 // Prompt["destroy"]();
				 // Prompt['error'](data.error);
				  reject(data);
				}
			}).catch(result => {
				if (result.response.data.status === 111) {
					//Prompt['error']("异地登录");
					//return;
				}
				if (result.response.data.status === 222) {
					//Prompt['error']("登录过期",function(){
					//		history.push('/');
					//	});
					return;
				}
			});
    });
    return promise;
}

export default httpAjax;