module.exports = {
    // 发布模式
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    },
    runtimeCompiler: true,
    publicPath: './', // 设置打包文件相对路径, baseUrl 已被官方不建议使用

    devServer: {
        // host: 'localhost',
        port: 8088,
        open: process.platform === 'darwin', //配置自动启动浏览器
        https: false,
        hotOnly: false,
        proxy: { // 跨域请求代理 https://www.cnblogs.com/cckui/p/10331432.html
            '/api': {
                target: 'http://101.132.135.179:8088', // 接口地址
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    productionSourceMap: true, // 生产环境是否生成 sourceMap 文件,

    //  configureWebpack: {
    //   performance:{ // webpack打包压缩限制报错这里禁掉这个warning信息
    //     hints: false
    //   }
    // }
}