import Vue from 'vue'
import Vuex from 'vuex'
import task from './modules/task'
import middlewares from './middlewares'
import online_curriculum from './modules/online_curriculum'
import offline_curriculum from './modules/offline_curriculum'
import project from './modules/project'
import auth from './modules/auth'
import message from './modules/message'
import download_data from './modules/download_data'
import production from './modules/production'
import device from './modules/device'

import main from './main'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  ...main,
  modules: {
    task,
    online_curriculum,
    offline_curriculum,
    project,
    auth,
    message,
    download_data,
    production,
    device,
  },
  plugins: middlewares,
  strict: debug,
})
