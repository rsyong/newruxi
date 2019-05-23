// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import Viser from 'viser-vue'
import Antd from 'ant-design-vue'
import axios from 'axios'

Vue.prototype.$axios = axios
//Vue.prototype.HOST = '/sosoapi';//跨域请求地址，在config下index.js里面设置
Vue.prototype.HOST = 'http://no1.ybinu.cn/ruxi';
//Vue.prototype.url = 'http://www.baidu.com/';// 服务器配置接口地址
Vue.prototype.timeout='10';
Vue.config.productionTip = false;
Vue.use(Viser)
Vue.use(Antd)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
