import Vue from 'vue'
import App from './App.vue'
import plugin from './utils/plugin';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/fonts/linecons/css/linecons.css'
import './assets/css/fonts/fontawesome/css/font-awesome.min.css'
import './assets/css/bootstrap.css'
import './assets/css/xenon-core.css'
import './assets/css/xenon-components.css'
import './assets/css/xenon-skins.css'
import './assets/css/nav.css'

import router from './router';
import './permission';

Vue.config.productionTip = false
Vue.use(plugin)
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
