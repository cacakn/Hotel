import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import './assets/styles/reset.css'
import './assets/styles/common.css'
import './plugins/element.js'
import './plugins/vcharts.js'
import 'swiper/dist/css/swiper.css'
import '@/assets/icons/iconfont.css'

import axios from 'axios'
import qs from 'qs'

import TreeTable from 'vue-table-with-tree-grid'

import NProgress from 'nprogress'
import '@/assets/styles/nprogress.css'


axios.defaults.withCredentials = true; //让ajax携带cookie
// 配置请求根路径
// axios.defaults.timeout = 5000 // 请求超时
// axios.defaults.baseURL = '/api'
// 在require拦截器中展示进度条 Nprogress.start()
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(config => {
        console.log(config)
        NProgress.start()
            // config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须 return config
        return config
    })
    // 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})

Vue.prototype.$http = axios

Vue.prototype.qs = qs;

Vue.prototype.axios = axios;

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.prototype.getCookie = function(name) {
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
    document.cookie = name + "=" + escape(value);
}
Vue.use(VueAwesomeSwiper)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')