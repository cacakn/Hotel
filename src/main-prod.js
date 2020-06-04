import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import './assets/styles/reset.css'
import './assets/styles/common.css'
// import './plugins/element.js'
// import './plugins/vcharts.js'
import 'swiper/dist/css/swiper.css'
import '@/assets/icons/iconfont.css'

import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

import NProgress from 'nprogress'

// 配置请求根路径
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.timeout = 5000 // 请求超时
// axios.defaults.baseURL = '/api'
// 在require拦截器中展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
        console.log(config)
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 最后必须return config
        return config
    })
    // 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios

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

Vue.use(VueAwesomeSwiper)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')