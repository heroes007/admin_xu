/**
 * Created by lesonli on 2016/11/15.
 */
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';

import {
  sync
} from 'vuex-router-sync'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/style.css'
import store from './store';
import router from './config/router';
//import {HttpConfig} from './config/http';
import {
  MyEditor
} from './config/editor';
import {
  LocalFilters
} from './config/filters';
import {
  user_info,
  logout
} from './api/modules/auth';

//本地存储
import VueLocalStorage from 'vue-localstorage'

import {
  MessageBox
} from 'element-ui';

Vue.use(ElementUI)
Vue.use(VueLocalStorage)

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

router.beforeEach((to, from, next) => {
  if (store.state.auth.userInfo || to.name === 'login' || to.name ==='team-grouping') {
    next();
  } else {
    user_info().then((res) => {
      if (res.data.res_code === 1) {
        if (res.data.msg.role_arr.indexOf(1) > -1 || res.data.msg.role_arr.indexOf(7) > -1
         || res.data.msg.role_arr.indexOf(8) > -1 || res.data.msg.role_arr.indexOf(9) > -1) {
          store.dispatch('set_user_info', res.data.msg);
          
          if(Vue.prototype.localStorage.get('lastSelectedProject'))
          {
              store.dispatch('change_selected_project_id',parseInt(Vue.prototype.localStorage.get('lastSelectedProject')));
              store.dispatch('get_project_list');
              next();
          }
          else
          {
                      store.dispatch('get_project_list', {
            callback() {
              next({
                  path:'project'
              });
            }
          });
          }
        } else {
          next({
            path: '/login'
          });
          logout();
          MessageBox.alert('权限错误，请重新登录！', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        }
      } else {
        if (to.name !== 'login')
          next({
            path: '/login'
          });
        else
          next();
      }
    })
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});