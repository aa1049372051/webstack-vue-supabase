import Vue from 'vue';
import Router from 'vue-router';

import Index from './views/index.vue'
import About from './views/about.vue'
import Home from './views/home.vue'
import AdminIndex from './views/admin/index.vue'
import AdminSite from './views/admin/site.vue'
import AdminUser from './views/admin/user.vue'
import AdminLogin from './views/admin/login.vue'

Vue.use(Router)

const routes = [
    { path: '/', component: Index, name: 'index' },
    { path: '/about', component: About, name: 'about' },
    { path: '/home', component: Home, name: 'home' },
    { path: '/admin', component: AdminIndex, name: 'admin_index' },
    { path: '/adminsite', component: AdminSite, name: 'admin_site' },
    { path: '/adminlogin', component: AdminLogin, name: 'admin_login' },
    { path: '/adminuser', component: AdminUser, name: 'admin_user' },
]
export default new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior: () => {
        return {
            x: 0,
            y: 0
        };
    }
});