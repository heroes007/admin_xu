import Vue from 'vue'
import Vuex from 'vuex'
import subject from './modules/subject'
import period from './modules/period'
import roles from './modules/roles'
import student from './modules/student'
import task from './modules/task'
import user from './modules/user'
import lb from './modules/lb'
import middlewares from './middlewares'
import teacher from './modules/teacher'
import online_curriculum from './modules/online_curriculum'
import offline_curriculum from './modules/offline_curriculum'
import project from './modules/project'
import auth from './modules/auth'
import assignment from './modules/assignment'
import notification from './modules/notification'
import message from './modules/message'
import redeem_code from './modules/redeem_code'
import download_data from './modules/download_data'
import platform_update from './modules/platform_update'
import production from './modules/production'
import production_group from './modules/production_group'
import device from './modules/device'
import news from './modules/news'

import main from './main'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  ...main,
  modules: {
    subject,
    roles,
    student,
    period,
    task,
    user,
    lb,
    teacher,
    online_curriculum,
    offline_curriculum,
    project,
    auth,
    assignment,
    notification,
    message,
    redeem_code,
    download_data,
    platform_update,
    production,
    production_group,
    device,
    news
  },
  plugins: middlewares,
  strict: debug,
})