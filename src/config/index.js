import Vue from 'vue';
import store from '../store';
import router from './router';
import { user_info } from '../api/modules/auth';
import { sync } from 'vuex-router-sync';
import { Message } from 'iview';
import LoadingY from '../plug/index';
import config from './config';
import { Base64 } from 'js-base64';
import postData from '../api/postData'
Vue.prototype.$config = config;
window.$OnLine = new Vue()
window.$SplitGroupRefresh = new Vue()
window.$MakeAppointment = new Vue()

Vue.use(LoadingY)
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)
router.beforeEach((to, from, next) => {
    let toLogin = () => {
      if (to.name == 'login') {
          next();
      }
      else {
          sessionStorage.clear();
          next({path: '/login'});
      }
    }
    if(sessionStorage.getItem('token') && to.name === 'login') {
        let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
        if(roleId != 4)  {
            next({name: 'user-manage'})
        }
        else  {
            next({name: 'tutor-course'})
        }
    }else if (store.state.auth.userInfo || to.name === 'login') {
        next();
    } else {
        if (sessionStorage.getItem('token') && to.name !== 'login') {
            postData('user/getUserPermission',{from:"web"}).then((res) => {
                if(res.res_code === 1 && res.data){
                    sessionStorage.setItem('token',res.data.token)
                    sessionStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(res.data.permissions)));
                    user_info().then((res) => {
                        if (res.data.res_code === 1) {
                            let d = res.data.data;
                            sessionStorage.setItem('organizationId',d.organization_id)
                            store.dispatch('set_user_info', d);
                            sessionStorage.setItem('PERSONALDETAILS',JSON.stringify(d))
                            next();
                        } else toLogin()
                    })
                }else{
                    Message.warning('暂无权限');
                    toLogin()
                }
            })
        }else toLogin()
    }
})
export default router;