require('eventsource-polyfill');
require('babel-polyfill');
import _ from 'lodash';
import '@/assets/style/base.css';
import createElement from '@/common/common';
import userinfo from '@/modules/user/user';

let component=()=> {
    var element = document.createElement('div');
    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'Webpack'], ' ');
    return element;  
}

userinfo();

createElement('index中调用了createCom创建了新的组件');

document.getElementById('root').appendChild(component());