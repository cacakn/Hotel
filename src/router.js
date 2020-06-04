import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
import Full from '@/containers/Full'

// 把下面的路由 作懒加载处理
const Login = () =>
    import ( /* webpackChunkName: "users" */ '@/views/users/Login.vue')
const Register = () =>
    import ( /* webpackChunkName: "users" */ '@/views/users/Register.vue')
const Welcome = () =>
    import ( /* webpackChunkName: "users" */ '@/views/Welcome.vue')
const Users = () =>
    import ( /* webpackChunkName: "right" */ '@/views/user/Users.vue')
const Rights = () =>
    import ( /* webpackChunkName: "right" */ '@/views/power/Rights.vue')
const Roles = () =>
    import ( /* webpackChunkName: "right" */ '@/views/power/Roles.vue')
const GoodOrders = () =>
    import ( /* webpackChunkName: "order" */ '@/views/orders/GoodOrders.vue')
const RoomOrders = () =>
    import ( /* webpackChunkName: "order" */ '@/views/orders/RoomOrders.vue')
const UserOrders = () =>
    import ( /* webpackChunkName: "order" */ '@/views/orders/UserOrders.vue')
    // const Cate = () =>
    //     import ( /* webpackChunkName: "users" */ '@/views/goods/Cate.vue')
    // const GoodList = () =>
    //     import ( /* webpackChunkName: "users" */ '@/views/goods/List.vue')
    // const Add = () =>
    //     import ( /* webpackChunkName: "users" */ '@/views/goods/Add.vue')
    // 改
    // const Dashboard = () =>
    //     import ( /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue')
const Diagram = () =>
    import ( /* webpackChunkName: "charts" */ '@/views/charts/Diagram.vue')
const Slider = () =>
    import ( /* webpackChunkName: "dashboard" */ '@/views/charts/Slider.vue')
    // const Tables = () =>
    //     import ( /* webpackChunkName: "tables" */ '@/views/tables/Tables.vue')
const List = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/tables/list/List.vue')
const List1 = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/tables/list/List1.vue')
const List2 = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/tables/list/List2.vue')
const List3 = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/tables/list/List3.vue')
const List4 = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/tables/list/List4.vue')
const List5 = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/tables/list/List5.vue')
    // const Details = () =>
    //     import ( /* webpackChunkName: "tables" */ '@/views/tables/details/Details.vue')
const Setting = () =>
    import ( /* webpackChunkName: "tables" */ '@/views/setting/Setting.vue')
const NotFind = () =>
    import ( /* webpackChunkName: "home" */ '@/views/404.vue')

const Rooms = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Rooms.vue')
const Commodity = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Commodity.vue')
const Restaurant = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Restaurant.vue')
const Equipment = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Equipment.vue')
const Features = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Features.vue')
const History = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/History.vue')
const Background = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Background.vue')
const Peoplepicture = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/Peoplepicture.vue')
const Realnameverification = () =>
    import ( /* webpackChunkName: "users" */ '@/views/hotel/realnameverification.vue')

Vue.use(Router)

const router = new Router({
        // mode: 'history',
        base: process.env.BASE_URL,
        routes: [{
                path: '/',
                redirect: '/user/login'
            }, {
                path: '/user/login',
                name: 'Login',
                component: Login,
                meta: {
                    title: '登录'
                }
            },
            {
                path: '/user/register',
                name: 'Register',
                component: Register,
                meta: {
                    title: '注册'
                }
            },
            {
                path: '/welcome',
                // redirect: '/welcome',
                name: 'Full',
                component: Full,
                children: [{
                        path: '/welcome',
                        name: 'Welcome',
                        component: Welcome,
                    },
                    {
                        path: '/users',
                        name: 'Users',
                        component: Users,
                    },
                    {
                        path: '/rights',
                        component: Rights
                    },
                    {
                        path: '/roles',
                        component: Roles
                    },
                    {
                        path: '/rooms',
                        component: Rooms
                    },
                    {
                        path: '/commodity',
                        component: Commodity
                    },
                    {
                        path: '/restaurant',
                        component: Restaurant
                    },
                    {
                        path: '/equipment',
                        component: Equipment
                    },
                    {
                        path: '/features',
                        component: Features
                    },
                    {
                        path: '/history',
                        component: History
                    },
                    {
                        path: '/background',
                        component: Background
                    },
                    {
                        path: '/peoplepicture',
                        component: Peoplepicture
                    },
                    {
                        path: '/realnameverification',
                        component: Realnameverification
                    },
                    {
                        path: '/goodorders',
                        component: GoodOrders
                    },
                    {
                        path: '/roomOrders',
                        component: RoomOrders
                    },
                    {
                        path: '/userOrders',
                        component: UserOrders
                    },
                    // 待加
                    {
                        path: '/charts/diagram',
                        name: 'Diagram',
                        component: Diagram,
                    },
                    {
                        path: '/charts/slider',
                        name: 'Slider',
                        component: Slider,
                    },
                    {
                        path: '/list',
                        name: 'List',
                        component: List,
                    },
                    {
                        path: '/list1',
                        name: 'List1',
                        component: List1,
                    },
                    {
                        path: '/list2',
                        name: 'List2',
                        component: List2,
                    },
                    {
                        path: '/list3',
                        name: 'List3',
                        component: List3,
                    },
                    {
                        path: '/list4',
                        name: 'List4',
                        component: List4,
                    },
                    {
                        path: '/list5',
                        name: 'List5',
                        component: List5,
                    },
                    // {
                    //     path: '/tables',
                    //     redirect: '/tables/list',
                    //     name: 'Tables',
                    //     component: Tables,
                    //     children: [{
                    //             path: '/tables/list',
                    //             name: 'List',
                    //             component: List,
                    //         },
                    //         {
                    //             path: '/tables/details',
                    //             name: 'Details',
                    //             component: Details,
                    //         }
                    //     ]
                    // },
                    {
                        path: '/setting',
                        name: 'Setting',
                        component: Setting,
                    }
                ]
            },
            {
                path: '*',
                name: 'NotFind',
                component: NotFind,
                meta: {
                    title: '404'
                }
            }
        ]
    })
    // const originalPush = Router.prototype.push;
    // Router.prototype.push = function push(location) {
    //     return originalPush.call(this, location).catch(err => err)
    // };

// // 页面刷新时，重新赋值token
// if (localStorage.getItem('token')) {
//     store.commit('BIND_LOGIN', localStorage.getItem('token'))
// }

// // 全局导航钩子
// router.beforeEach((to, from, next) => {
//     if (to.meta.title) { // 路由发生变化修改页面title
//         document.title = to.meta.title
//     }
//     if (to.meta.requireLogin) {
//         if (store.getters.token) {
//             if (Object.keys(from.query).length === 0) { // 判断路由来源是否有query，处理不是目的跳转的情况
//                 next()
//             } else {
//                 let redirect = from.query.redirect // 如果来源路由有query
//                 if (to.path === redirect) { // 避免 next 无限循环
//                     next()
//                 } else {
//                     next({ path: redirect }) // 跳转到目的路由
//                 }
//             }
//         } else {
//             next({
//                 path: '/login',
//                 query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             })
//         }
//     } else {
//         next()
//     }
// })

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转

    if (to.path === '/user/login') return next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/user/login')
    next()
})

export default router