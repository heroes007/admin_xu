import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './config/index';
import './css';
//本地存储
import VueLocalStorage from 'vue-localstorage'

import ElementUI from 'element-ui'

import iView from 'iview';


Vue.use(ElementUI)
Vue.use(VueLocalStorage)
Vue.use(iView);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});