
import Vue from 'vue';
import store from '../store';
import router from './router';
import { user_info, logout } from '../api/modules/auth';
import { sync } from 'vuex-router-sync';
import { Message } from 'iview';
import LoadingY from '../plug/index';
import config from './config';
import { Base64 } from 'js-base64';

Vue.prototype.$config = config;
Vue.use(LoadingY)
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)
router.beforeEach((to, from, next) => {
    if (store.state.auth.userInfo || to.name === 'login') {
      next();
    } else {
      user_info().then((res) => {
        if (res.data.res_code === 1) {
          next();
        } else {
          if (to.name !== 'login') next({ path: '/login' });
          else next();
        }
      })
    }
  })
  export default router;