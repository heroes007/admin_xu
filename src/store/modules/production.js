import * as types from '../types'
import {
  get_list,
  add_product,
  update_product,
  switch_product,
  get_curriculums,
  add_curriculums,
  set_pre_curriculums,
  delete_curriculum,
  get_certificate,
  change_certificate,
  delete_certificate,
  add_certificate,
  edit_certificate,
  get_project_list,
  get_product_info
} from '../../api/modules/tools_product'


const state = {
  certificate_list: [],
  production_list: [],
  production_data_list: [],
  total: 0,
  isLoading: false,
  pre_curriculum_change_guard: null,
  cur_production_id: 0,
  add_product_state: false,
  edit_product_state: false,
  stateList: [{id: 3, name: '首页推荐'}, {id: 0, name: '编辑中'}, {id: 1, name: '正常'}, {id: 2, name: '不可购买'}],
  examineTypeList: [{id: 0, name: '笔试和面试'}, {id: 1, name: '只面试'}, {id: 2, name: '只笔试'}, {id: 3, name: '免笔试面试'}],
}

// actions
const actions = {
  get_production_data_list ({commit}, param) {
    get_project_list(param).then(res => {
      console.log(res, 'resresresres')
    })
  },

  get_production_list({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    get_list(param).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_LIST_LOADED, res.data.msg)
      }
      if (param.callback)
        param.callback();
    })
  },
  get_certificate_list({commit}) {
    get_certificate().then(res => {
      commit(types.PRODUCTION_CERTIGICATE, res.data);
    })
  },
  change_production_vailid({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    switch_product(param.id, param.value ? 1 : 0).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_VALID_UPDATED, param)
      }
    })
  },
  change_production_state({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    switch_product(param.id, param.value).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_VALID_UPDATED, param)
      }
    })
  },
  add_production({commit}, param) {
    commit('add_product_states',false)
    commit(types.PRODUCTION_SHOW_LOADING);
    add_product(param).then(res => {
      if (res.data.res_code === 1) {
        commit('add_product_states',true)
        // commit(types.PRODUCTION_ADDED, {result: res.data.msg, data: param})
        // if(param.certificate.length){
          // change_certificate(param.certificate, res.data.msg).then(res => {
          //   console.log(res.data)
          // })
        // }
        if (param._fn)
          param._fn();
      }
    })
  },
  update_production({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    commit('edit_product_states',false)
    update_product(param).then(res => {
      if (res.data.res_code === 1) {
        commit('edit_product_states',true)
        let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
        get_product_info(id).then(res => {
          if(res.data.res_code == 1){
            localStorage.setItem('PRODUCTINFO',JSON.stringify(res.data.data))
          }
        })
        // commit(types.PRODUCTION_UPDATED, param)
        // if(param.certificate.length){
        //   change_certificate(param.certificate, param.product_id).then(res => {
        //     console.log(res.data)
        //   })
        // }
        if (param._fn)
          param._fn();
      }
    })
  },
  delete_production({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    switch_product(param.id, -1).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_DELETED, param)
        if (param._fn)
          param._fn();
      }
    })
  },
  get_production_curriculums({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    get_curriculums(param).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_CURRICULUMS_LOADED, {result: res.data.msg, data: param})
      }
    })
  },
  add_production_curriculums({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    add_curriculums(param.id, param.curriculums).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_CURRICULUMS_ADDED, param)
        if (param._fn)
          param._fn();
      }
    })
  },
  delete_production_curriculums({commit}, param) {
    commit(types.PRODUCTION_SHOW_LOADING);
    delete_curriculum(param.id, param.curriculum_id).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_CURRICULUMS_DELETED, param);
        if (param._fn)
          param._fn();
      }
    })
  },
  change_production_curriculum_pre_curriculum({commit}, params) {
    if (state.pre_curriculum_change_guard && params.value.length === state.pre_curriculum_change_guard.length) {
      return;
    }
    commit(types.PRODUCTION_SHOW_LOADING);
    commit(types.PRODUCTION_CHANGE_PRE_GUARD, params.value);
    set_pre_curriculums(state.cur_production_id, params.id, params.value).then(res => {
      if (res.data.res_code === 1) {
        commit(types.PRODUCTION_CHANGE_PRE_CURRICULUM, params);
      }
    })
  },
  set_cur_production({commit}, param) {
    commit(types.CUR_PRODUCTION_SETTED, param);
  },
  delete_certificate({commit}, param) {
    delete_certificate(param.id).then(res => {
      if(res.data.res_code === 1) {
        commit(types.CERTIFICATE_DELETED,param);
      }
    })
  },
  add_certificate({commit}, param) {
    add_certificate(param).then(res => {
      if(res.data.res_code === 1){
        commit(types.ADD_CERTIFICATE, param)
        param._fn();
      }
    })
  },
  edit_certificate({commit}, param) {
    edit_certificate(param).then(res => {
      if(res.data.res_code === 1){
        commit(types.CHANGE_CERTIFICATE, param)
        param._fn();
      }
    })
  }
}
// mutations
const mutations = {
  add_product_states(state,param){
    state.add_product_state = param
  },
  edit_product_states(state,param){
    state.edit_product_state = param
  },
  [types.PRODUCTION_CLEAR](state) {
    state.production_list = [];
  },
  [types.PRODUCTION_SHOW_LOADING](state) {
    state.isLoading = true;
  },
  [types.PRODUCTION_LIST_LOADED](state, param) {
    for (var i = 0; i < param.products.length; i++) {
      param.products[i].online_curriculum_list = [];
      param.products[i].offline_curriculum_list = [];
      param.products[i].is_valid = param.products[i].state === 1 ? true : false;
    }
    state.production_list = param.products;
    state.total = param.count;
    state.isLoading = false;
  },
  [types.PRODUCTION_CERTIGICATE](state, param) {
    state.certificate_list = param.data
  },
  [types.PRODUCTION_VALID_UPDATED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        state.production_list[i][param.key] = param.value;
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_ADDED](state, param) {
    state.production_list.push({
      id: param.result,
      code: param.data.code,
      title: param.data.title,
      price: param.data.price,
      original_price: param.data.original_price,
      state: 0,
      is_valid: false
    })
    state.isLoading = false;
  },
  [types.PRODUCTION_UPDATED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.product_id) {
        state.production_list[i].title = param.title;
        state.production_list[i].price = param.price;
        state.production_list[i].original_price = param.original_price;
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_DELETED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        state.production_list.splice(i, 1);
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CURRICULUMS_LOADED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.data) {
        for (var j = 0; j < param.result.length; j++) {
          param.result[j].id = param.result[j].curriculum_id;
        }
        state.production_list[i].online_curriculum_list = param.result;
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CURRICULUMS_ADDED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        for (var j = 0; j < param.curriculumData.length; j++) {
          state.production_list[i].online_curriculum_list.push({
            id: param.curriculumData[j].curriculum_id,
            curriculum_id: param.curriculumData[j].curriculum_id,
            teacher_name: param.curriculumData[j].teacher_name,
            title: param.curriculumData[j].title,
            pre_curriculums: []
          });
        }
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CURRICULUMS_DELETED](state, param) {
    for (var i = 0; i < state.production_list.length; i++) {
      if (state.production_list[i].id === param.id) {
        for (var j = 0; j < state.production_list[i].online_curriculum_list.length; j++) {
          if (state.production_list[i].online_curriculum_list[j].curriculum_id === param.curriculum_id) {
            state.production_list[i].online_curriculum_list.splice(j, 1);
            break;
          }
        }
        break;
      }
    }
    state.isLoading = false;
  },
  [types.PRODUCTION_CHANGE_PRE_GUARD](state, param) {
    state.pre_curriculum_change_guard = param;
  },
  [types.PRODUCTION_CHANGE_PRE_CURRICULUM](state, params) {
    // for(var i = 0; i < state.production_list.length; i++)
    // {
    //     if (state.production_list[i].id === state.cur_production_id) {
    //         for(var j=0;j<state.production_list[i].online_curriculum_list.length;j++)
    //         {
    //             if(state.production_list[i].online_curriculum_list[j].curriculum_id === params.id)
    //             {
    //                 state.production_list[i].online_curriculum_list[j][params.key] = params.value.concat();
    //             }
    //             break;
    //         }
    //     }
    // }
    state.pre_curriculum_change_guard = null;
    state.isLoading = false;
  },
  [types.CUR_PRODUCTION_SETTED](state, param) {
    state.cur_production_id = param;
  },
  [types.CERTIFICATE_DELETED](state, param) {
    for(var i=0;i<state.certificate_list.length;i++) {
      if(state.certificate_list[i].id === param.id) {
        state.certificate_list.splice(i,1);
        break;
      }
    }
  },
  [types.ADD_CERTIFICATE](state, param) {
    param.id = state.certificate_list[state.certificate_list.length - 1].id + 1
    state.certificate_list.push(param)
  },
  [types.CHANGE_CERTIFICATE](state, param) {
    state.certificate_list.forEach((item, index) => {
      if(item.id === param.id){
        state.certificate_list.splice(index, 1, param)
      }
    })
  }
}

export default {
  state,
  actions,
  mutations
}
