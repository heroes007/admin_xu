import * as types from '../types'
import api from '../../api/modules/config'
import {get_student_list, search_userinfo_by_nickname_or_phone} from '../../api/modules/student'
import {
  get_all_students,
  new_version_create_student,
  edit_student,
  send_student_online_curriculum,
  get_students_by_offline_term,
  send_student_offline_curriculum
} from '../../api/modules/tools_student'

const state = {
  isInited: false,
  student_list: [],
  total: 0,
  curPage: 1,
  pageSize: 20,
  isLoading: false,
  search_result: null,
  search_msg: '',
  showLoading: false,
  stateList: [{
    id: 1,
    name: '正常'
  }, {
    id: 2,
    name: '毕业'
  }, {
    id: 3,
    name: '退学'
  }, {
    id: 4,
    name: '延缓'
  }]
}
var catch_page_list_data = {}

// actions
const actions = {
  delete_store({commit}, param) {
    commit(types.STUDENT_DELETE, param)
  },
  clear_store({commit}) {
    commit(types.STUDENT_CLEAR)
  },
  get_student_list({commit}, param) {
    commit(types.STUDENT_SHOW_LOADING)
    // if(param.project_id){
    get_all_students(param.no_group, param.project_id, param.curPage && param.curPage - 1 || 0, param.pageSize || state.pageSize, param.grade_id, param.subject_id, param.phone, param.username, param.realname, param.is_test_user, param.states, param.user_id, param.product_id).then(res => {
      if (res.data.res_code === 1) {
        commit(types.STUDENT_LIST_LOADED, res.data.msg,);
        catch_page_list_data[param.curPage && param.curPage - 1 || 0] = res.data.msg;
      }
    })
    // }
    // if (!catch_page_list_data[param.curPage && param.curPage - 1 || 0]) {
    //     if ((state.curPage - 1) * state.pageSize < state.total || state.student_list.length === 0) {
    //         get_all_students(param.no_group, param.project_id, param.curPage && param.curPage - 1 || 0, param.pageSize || state.pageSize).then(res => {
    //             if (res.data.res_code === 1) {
    //                 commit(types.STUDENT_LIST_LOADED,
    //                     res.data.msg,
    //                 );
    //                 catch_page_list_data[param.curPage && param.curPage - 1 || 0] = res.data.msg;
    //             }
    //         })
    //     }
    // } else {
    //     commit(types.STUDENT_LIST_LOADED,
    //         catch_page_list_data[param.curPage - 1 || state.curPage - 1]
    //     );
    // }

    //commit(types.STUDENT_PAGE_DATA_SETTED,param)
    //
    //if((state.curPage - 1) * state.pageSize < state.total || state.student_list.length === 0)
    //{
    //  get_student_list(param.curPage - 1,param.pageSize).then((res) => {
    //      if(res.data.res_code === 1)
    //      {
    //          commit(types.STUDENT_LIST_LOADED,res.data.msg);
    //      }
    //  });
    //}
  },
  search_userinfo_by_nickname_or_phone({commit}, param) {
    commit(types.SEARCH_STUDENT_LOADING);
    search_userinfo_by_nickname_or_phone(param.searchType, param.searchData).then((res) => {
      if (res.data.res_code === 1) {
        commit(types.SEARCH_STUDENT_LOADED, {
          data: res.data.msg[0],
          msg: ''
        });
      } else {
        alert(res.data.msg);
        commit(types.SEARCH_STUDENT_LOADED, {
          data: null,
          msg: res.data.msg
        });
      }
    });
  },
  add_student({commit}, params) {
    commit(types.STUDENT_SHOW_LOADING);
    new_version_create_student(params).then(res => {
      if (res.data.res_code === 1) {
        params._fn();
        params.callback();
        commit(types.STUDENT_ADDED, {
          data: params,
          result: res.data.msg
        });
      }
    })
  },
  edit_student({commit}, params) {
    commit(types.STUDENT_SHOW_LOADING);
    edit_student(params.student_id, params).then(res => {
      if (res.data.res_code === 1) {
        commit(types.STUDENT_EDITED, params);
        params._fn();
      }
    })
  },
  send_student_online_curriculum({commit}, params) {
    commit(types.STUDENT_SHOW_LOADING);
    send_student_online_curriculum(params).then(res => {
      if (res.data.res_code === 1) {
        commit(types.SEND_STUDENT_ONLINE_CURRICULUM, res.data.msg);
      }
    })
  }
}
// mutations
const mutations = {
    [types.STUDENT_SHOW_LOADING](state) {
        //state.student_list = param.results;
        //state.total = param.total_count;
        state.showLoading = true;
    },
    [types.STUDENT_LIST_LOADED](state, param) {
        //state.student_list = param.results;
        state.total = param.count;
        state.student_list = param.list;
        state.showLoading = false;

        state.isInited = true;
    },
    [types.STUDENT_PAGE_DATA_SETTED](state, param) {
        state.curPage = param.curPage;
        state.pageSize = param.pageSize;
    },
    [types.STUDENT_COUNT_LOADED](state, param) {
        state.total = param
    },
    [types.SEARCH_STUDENT_LOADING](state) {
        state.isLoading = true;
    },
    [types.SEARCH_STUDENT_LOADED](state, param) {
        state.isLoading = false;
        state.search_result = param.data;
        state.search_msg = param.msg;
    },
    [types.STUDENT_ADDED](state, params) {
        let id = Number.isInteger(params.result) ? params.result : ''
        let isProductAndUserEqually = false
        let item = {
            user_id: params.data.user_id,
            grade_id: params.data.grade_id,
            subject_id: params.data.subject_id,
            nickname: params.data.nickname,
            realname: params.data.realname,
            phone: params.data.phone,
            product_id: params.data.product_id,
            roles: params.data.roles,
            create_time: params.data.create_time,
            state: 1,
            times: 0
        }
        state.student_list.forEach((t,k) => {
            if (state.isInited){
                if(t.user_id === params.data.user_id && t.product_id === params.data.product_id){
                    isProductAndUserEqually = true
                    state.student_list.splice(k,1,{...item,id: t.id})
                }
            }
        });
       if(!isProductAndUserEqually && state.isInited) state.student_list.push({...item,id})
        state.showLoading = false;
    },
    [types.STUDENT_EDITED](state, params) {
        if (state.isInited) {
            for (var i = 0; i < state.student_list.length; i++) {
                if (state.student_list[i].user_id === params.user_id) {
                    state.student_list[i].grade_id = params.grade_id;
                    state.student_list[i].subject_id = params.subject_id;
                    state.student_list[i].realname = params.realname;
                    break;
                }
            }
        }
    state.showLoading = false;
  },
  [types.SEND_STUDENT_ONLINE_CURRICULUM](state, params) {
    state.showLoading = false;
  },
  [types.STUDENT_CLEAR](state) {
    state.student_list = [];
  },
  [types.STUDENT_DELETE](state, param) {
    state.student_list.splice(param, 1)
  }
}

export default {
  state,
  actions,
  mutations
}
