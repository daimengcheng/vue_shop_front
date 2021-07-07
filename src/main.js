import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./vuex/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import './plugins/element.js'
import treeTable from 'vue-table-with-tree-grid'
Vue.use(ElementUI)
Vue.component('tree-table', treeTable)
Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
    router,
    store
}).$mount("#app");
// 通过路由守卫 检查是否登录 进行跳转
router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && window.sessionStorage.getItem('token') === '') {
        next({ name: 'login' })
    } else {
        next()
    }
})