import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/Global.css'

// 引入组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
