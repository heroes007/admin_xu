import Vue from 'vue';
import store from '../store';
import router from './router';
import { user_info, logout } from '../api/modules/auth';
import { sync } from 'vuex-router-sync';
import { Message } from 'iview';
import LoadingY from '../plug/index';
import config from './config';
import { Base64 } from 'js-base64';
import postData from '../api/postData'
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
        let d = res.data.data;
        localStorage.setItem('organizationId',d.organization_id)
        store.dispatch('set_user_info', d);
        localStorage.setItem('PERSONALDETAILS',JSON.stringify(d))
        postData('user/getUserPermission',{from:"web"}).then((res) => {
          if(res.res_code === 1 && res.data){
            localStorage.setItem('token',res.data.token)
            localStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(res.data.permissions)));
            next();
          }else{
            Message.warning('暂无权限');
          }
        })
      } else {
        if (to.name !== 'login') next({ path: '/login' });
        else next();
      }
    })
  }
})
export default router;
