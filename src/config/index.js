
import Vue from 'vue';
import store from '../store';
import router from './router';
import { user_info, logout } from '../api/modules/auth';
import { sync } from 'vuex-router-sync';
import { Message } from 'iview';
import LoadingY from '../plug/index';
import config from './config';
Vue.prototype.$config = config;
Vue.use(LoadingY)
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)
router.beforeEach((to, from, next) => {
    if (store.state.auth.userInfo || to.name === 'login' || to.name ==='team-grouping') {
      next();
    } else {
      user_info().then((res) => {
        if (res.data.res_code === 1) {
          let roleArr = res.data.msg.role_arr
          if (roleArr.includes(1) || roleArr.includes(7) || roleArr.includes(8) || roleArr.includes(9)) {
            store.dispatch('set_user_info', res.data.msg);
            if(Vue.localStorage.get('lastSelectedProject')){
                store.dispatch('change_selected_project_id',parseInt(Vue.localStorage.get('lastSelectedProject')));
                store.dispatch('get_project_list');
                next();
            }else{
                store.dispatch('get_project_list', {
                  callback() {
                      next({ path:'dashboard' });
                  }
                });
             }
          } else {
            next({ path: '/login' });
            logout();
            Message.warning('权限错误，请重新登录');
          }
        } else {
          if (to.name !== 'login') next({ path: '/login' });
          else next();
        }
      })
    }
  })
  export default router;