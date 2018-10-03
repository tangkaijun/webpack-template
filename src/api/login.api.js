import httpAjax from "@/utils/httpAjax.js";

export default {
     name:"login",
     api:{
        getUserInfo(param) {//获取用户信息
			return httpAjax("post", "/api/user/getUserById",param);
		}
     }
}

