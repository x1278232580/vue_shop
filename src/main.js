import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/Global.css'

// 引入组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入样式
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios  请求拦截
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

// 引入树形表格
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 过滤器
Vue.filter('dateFormat', function (originVal) {

  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
