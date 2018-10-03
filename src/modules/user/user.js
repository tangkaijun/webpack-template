import '@/assets/style/base.css';
import createCom from '@/common/common.js';
import React from 'react';
import Api from '@/api';

createCom("用户信息");

let msgInfo = ()=>{
	Api.default.api.getUserInfo({uid:233});
	console.log('创建了用户信息');
}

export default msgInfo;