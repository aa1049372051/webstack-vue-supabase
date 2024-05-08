import router from './router';

const needLogin = [
    'index', 'about', 'home'
]
router.beforeEach((to, from, next) => {
    if (!to.name) {
        next()
        return
    }
    console.log(to, from)
    let loginDataSyj = window.localStorage.getItem('loginData-webstack');
    if (needLogin.indexOf(to.name) > -1) {
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
