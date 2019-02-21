import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './config/index';
import './css';
import VueLocalStorage from 'vue-localstorage'
import iView from 'iview';

// import ElementUI from 'element-ui'

// Vue.use(ElementUI)

Vue.use(iView);
Vue.use(VueLocalStorage)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
