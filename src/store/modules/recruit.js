
import * as types from '../types'
import api from '../../api/modules/config'
import {
    get_signup_list,
    update_interview,
    set_interview_tutor,
    send_interview_msg,
    drop_student_signup
} from '../../api/modules/exam'

const state = {
    isLoading: false,
    recruit_list: [],
    result_list: [
        { id: 0, name: '未通过' }, { id: 1, name: '通过' }
    ],
    state_list:[
         { id: 0, name: '未面试' }, { id: 1, name: '已面试' }
    ],
    total: 100
}

// actions
const actions = {
    get_recruit_list({ commit }, param) {
        commit(types.RECRUIT_SHOW_LOADING);
        get_signup_list(param.curPage - 1, param.pageSize, param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.RECRUIT_LIST_LOADED, res.data.msg);
            }
        })
    },
    change_interview_result({ commit }, param) {
        commit(types.RECRUIT_SHOW_LOADING);
        update_interview(param.id, param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.RECRUIT_INTERVIEW_RESULT_UPDATED, param);
                if(param.callback)
                   param.callback() 
            }
        })

    },
    change_interview_state({ commit }, param) {
        commit(types.RECRUIT_SHOW_LOADING);
        update_interview(param.id, param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.RECRUIT_INTERVIEW_STATE_UPDATED, param);
                if(param.callback)
                   param.callback() 
            }
        })

    },
    change_interview_time({ commit }, param) {
        commit(types.RECRUIT_SHOW_LOADING);
        // update_interview(param.id, {interview_time:param.value}).then(res => {
        //     if (res.data.res_code === 1) {
        //         commit(types.RECRUIT_INTERVIEW_TIME_UPDATED, param);
        //     }
        // })
        commit(types.RECRUIT_INTERVIEW_TIME_UPDATED, param);
    },
    set_interview_tutor({ commit }, param) {
        commit(types.RECRUIT_SHOW_LOADING);
        set_interview_tutor(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.RECRUIT_INTERVIEW_TIME_UPDATED, param);
            }
        })
    },
    drop_student_signup({ commit },param) {
        commit(types.RECRUIT_SHOW_LOADING);
        drop_student_signup(param.id).then(res => {
            if (res.data.res_code === 1) {
                commit(types.RECRUIT_DROPPED, param);
                if(param._fn)
                    param._fn();
            }
        })
    }
}
// mutations
const mutations = {
    [types.RECRUIT_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.RECRUIT_LIST_LOADED](state, param) {
        for (var i = 0; i < param.signup_list.length; i++) {
            if (param.signup_list[i].score) {
                param.signup_list[i].score = parseFloat(param.signup_list[i].score);
            }
        }
        state.recruit_list = param.signup_list || state.recruit_list;
        state.total = param.count;
        state.isLoading = false;
    },
    [types.RECRUIT_INTERVIEW_STATE_UPDATED](state, param) {
        for (var i = 0; i < state.recruit_list.length; i++) {
            if (state.recruit_list[i].id === param.id) {
                state.recruit_list[i].interview_state = param.interview_state;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.RECRUIT_INTERVIEW_RESULT_UPDATED](state, param) {
        for (var i = 0; i < state.recruit_list.length; i++) {
            if (state.recruit_list[i].id === param.id) {
                state.recruit_list[i].interview_result = param.interview_result;
                state.recruit_list[i].interview_comment = param.interview_comment;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.RECRUIT_INTERVIEW_TIME_UPDATED](state, param) {
        for (var i = 0; i < state.recruit_list.length; i++) {
            if (state.recruit_list[i].id === param.id) {
                state.recruit_list[i][param.key] = param.value;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.RECRUIT_DROPPED](state, param) {
        for (var i = 0; i < state.recruit_list.length; i++) {
            if (state.recruit_list[i].id === param.id) {
                state.recruit_list.splice(i,1)
                break;
            }
        }
        state.isLoading = false;
    },
}

export default {
    state,
    actions,
    mutations
}
