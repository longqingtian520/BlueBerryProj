// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './permission'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icons' // icon
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import {addDateRange, resetForm} from './utils/ruoyi'
import Pagination from "@/components/Pagination";

import Cookies from 'js-cookie'

import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'; //导入模块

moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment;//赋值使用

Vue.prototype.addDateRange = addDateRange
Vue.prototype.resetForm = resetForm

Vue.use(ElementUI)
Vue.config.productionTip = false

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
