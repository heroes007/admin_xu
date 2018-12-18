/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import {
    get_list,
    search_user,
    get_teachers,
    get_student_managers,
    create_test_user
} from '../../api/modules/tools_user'

const state = {
    user_list: [],
    total: 999,
    curPage: 1,
    pageSize: 20,
    isLoading: false,
    searchParam: '',
    searchType: 'phone',
    getTeachers: [],
    getStudentManagers: [],
    role_id:0
}

// getters
// actions
const actions = {
        get_user_list({
            commit
        }, param) {

            if (state.searchParam) {
                param.param = state.searchParam;
                param.type = state.searchType;
                param.role_id = state.role_id;
            }

            commit(types.USER_PAGE_DATA_SETTED, param);

            if (state.searchParam) {
                search_user(param.type, param.param, param.curPage - 1, param.pageSize, param.role_id).then((res) => {
                    if (res.data.res_code === 1) {
                        commit(types.USER_LIST_LOADED, res.data.msg);
                    }
                });
            } else if ((state.curPage - 1) * state.pageSize < state.total || state.user_list.length === 0) {
                get_list(param.curPage - 1, param.pageSize, param.role_id).then((res) => {
                    if (res.data.res_code === 1) {
                        commit(types.USER_LIST_LOADED, res.data.msg);
                    }
                });
            }
        },
        search_user_list({
            commit
        }, param) {
            commit(types.USER_PAGE_DATA_SETTED, param);

            if (param.param) {
                search_user(param.type, param.param, param.curPage - 1, param.pageSize, param.role_id).then((res) => {
                    if (res.data.res_code === 1) {
                        commit(types.USER_LIST_LOADED, res.data.msg);
                    }
                });
            } else {
                get_list(param.curPage - 1, param.pageSize, param.role_id).then((res) => {
                    if (res.data.res_code === 1) {
                        commit(types.USER_LIST_LOADED, res.data.msg);
                    }
                });
            }
        },
        get_teachers({
            commit
        }, param) {
            if(state.getTeachers.length === 0)
            {
                get_teachers().then(res => {
                if (res.data.res_code === 1) {
                    commit(types.USER_GET_TEACHERS, res.data.msg);
                }
            })
            }
        },
        get_student_managers({
            commit
        }, param) {
            get_student_managers().then(res => {
                if (res.data.res_code === 1) {
                    commit(types.USER_GET_STUDENT_MANAGERS, res.data.msg);
                }
            })
        },
        change_user_role({ commit }, param) {
            commit(types.USER_ROLE_CHANGED,param)
        }
    }
    // mutations
const mutations = {
    [types.USER_LIST_LOADED](state, param) {
        state.user_list = param.list;
        state.total = param.count;
    },
    [types.USER_PAGE_DATA_SETTED](state, param) {
        state.curPage = param.curPage;
        state.pageSize = param.pageSize;
        state.searchType = param.type;
        state.searchParam = param.param;
        state.role_id = param.role_id;
    },
    [types.USER_GET_TEACHERS](state, param) {
        state.getTeachers = param;
    },
    [types.USER_GET_STUDENT_MANAGERS](state, param) {
        state.getStudentManagers = param;
    },
    [types.USER_ROLE_CHANGED](state,param) {
        for(var i=0;i<state.user_list.length;i++)
        {
            if(state.user_list[i].user_id === param.user_id)
            {
                state.user_list[i].roles = param.roles;
            }
        }
    }
}

export default {
    state,
    actions,
    mutations
}
