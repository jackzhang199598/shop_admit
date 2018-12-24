import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.less'
import axios from 'axios'
Vue.prototype.axios = axios
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    console.log(config)
    config.baseURL = 'http://localhost:8888/api/private/v1/'
    config.headers.Authorization = localStorage.getItem('token111')
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response.data
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
