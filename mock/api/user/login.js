/**
 * 用户管理 - 用户登录接口
 *  
 * @url login
*/

module.exports = function(req){
	console.log(req);
	return {
		code:0,
		data:{
			"msg":"login successful"
		},
	};
}