const Login = () => import( /* webpackChunkName: "group-login" */ '../pages/Login/Login')
const Home = () => import( /* webpackChunkName: "group-home" */ '../pages/Home/Home')
const Welcome = () => import( /* webpackChunkName: "group-home" */ '../components/Welcome/Welcome')
const User = () => import( /* webpackChunkName: "group-user" */ '../pages/User/User')
const Rights = () => import( /* webpackChunkName: "group-right" */ '../pages/Rights/Rights')
const Roles = () => import( /* webpackChunkName: "group-right" */ '../pages/Rights/Roles')
const Goods = () => import( /* webpackChunkName: "group-goods" */ '../pages/Goods/Goods')
const Params = () => import( /* webpackChunkName: "group-goods" */ '../pages/Goods/Params')
const Categories = () => import( /* webpackChunkName: "group-goods" */ '../pages/Goods/Categories')
const Orders = () => import( /* webpackChunkName: "group-orders" */ '../pages/Orders/Orders')
const Add = () => import( /* webpackChunkName: "group-orders" */ '../pages/Goods/Add')
const Reports = () => import( /* webpackChunkName: "group-Reports" */ '../pages/Reports/Reports')

const routes = [{
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        component: Home,
        redirect: '/home/welcome',
        children: [{
                path: '/home/welcome',
                name: '首页',
                component: Welcome
            }, {
                path: '/home/users',
                name: '用户列表',
                component: User
            },

            {
                path: '/home/rights',
                name: '权限列表',
                component: Rights
            },
            {
                path: '/home/roles',
                name: '角色列表',
                component: Roles
            },
            {
                path: '/home/params',
                name: '分类参数',
                component: Params
            },
            {
                path: '/home/categories',
                name: '商品分类',
                component: Categories
            },
            {
                path: '/home/goods',
                name: '商品列表',
                component: Goods,
            },
            {
                path: '/home/orders',
                name: '订单列表',
                component: Orders
            },
            {
                path: '/home/reports',
                name: '数据报表',
                component: Reports
            },
            {
                path: '/home/goods/add',
                name: '添加商品',
                component: Add
            }
        ]
    }

]
export default routes