// 这是项目发布阶段需要用到的babel用到的插件
const proPlugins = []
if (process.env.NODE_ENV === 'production') {
    proPlugins.push('transform-remove-console')
}
module.exports = {
    "presets": [
        "@vue/app"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            },
            "syntax-dynamic-import"
        ],
        // 发布产品后的插件数组
        ...proPlugins
    ]
}