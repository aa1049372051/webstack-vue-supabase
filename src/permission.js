import router from './router';

const notNeedLogin = [
    'index', 'about', 'home'
]
router.beforeEach((to, from, next) => {
    console.log(to, from)
    if (!to.name) {
        router.push({
            name: 'index',
            query: to.query
        });
        return
    }
    let loginDataSyj = window.localStorage.getItem('loginData-webstack');
    if (notNeedLogin.indexOf(to.name) > -1) {
        next()
        return
    } else {
        if (!loginDataSyj && to.name != 'admin_login') {
            //不存在登录信息
            router.push({
                name: 'admin_login',
                query: to.query
            });
            return false;
        } else if (loginDataSyj && to.name == 'admin_login') {
            router.push({
                name: 'admin_index'
            });
            return false;
        }
    }

    next();
});
