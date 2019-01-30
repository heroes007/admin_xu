
import * as types from '../types'
import api from '../../api/modules/config'
import { get_student_list, send, get_list, get_unread_num_grp_user } from '../../api/modules/tools_private_msg'

const state = {
    student_list: [
    ],
    isLoading: false,
    select_student_id: 0,
    select_msg_update: false,
    unread_list: [],
    unread_updata: false
}


// actions
const actions = {
    get_message_student_list({ commit }, param) {
        commit(types.MESSAGE_SHOW_LOADING);
        get_student_list(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.MESSAGE_STUDENT_LIST_LOADED, res.data.msg);
            }
        })
    },
    get_private_msg_list({ commit }, param) {
        commit(types.MESSAGE_SHOW_LOADING);
        for (var i = 0; i < state.student_list.length; i++) {
            if (state.student_list[i].id === param) {
                if (state.student_list[i].msg && state.student_list[i].msg.length > 0) {
                    commit(types.MESSAGE_SELECT_STUDENT_CHANGE, param);
                    return;
                }
            }
        }
        get_list(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.MESSAGE_LIST_LOADED, { id: param, data: res.data.msg });
            }
        })
    },
    send_private_msg({ commit }, param) {
        commit(types.MESSAGE_SHOW_LOADING);
        send(param.to_user_id, param.content).then(res => {
            if (res.data.res_code === 1) {
                commit(types.MESSAGE_ADDED, { id: res.data.msg, data: param, u_id: param.to_user_id });
            }
        })
    },
    add_private_msg({ commit }, param) {
        commit(types.MESSAGE_ADDED, { id: param.pm_id, data: param, u_id: param.from_user_id });
    },
    get_unread_list({ commit }) {
        get_unread_num_grp_user().then(res => {
            commit(types.UNREAD_COUNT_LOADED, res.data.msg);
        })
    },
    add_unread_count({ commit }, param) {
        commit(types.UNREAD_COUNT_ADDED, param);
    }
}

const getters = {
    message_list: state => {
        if (state.student_list) {
            for (var i = 0; i < state.student_list.length; i++) {
                if (state.student_list[i].user_id === state.select_student_id) {
                    return state.student_list[i].msg;
                }
            }
        } else {
            return undefined;
        }
    },
    message_select_student: state => {
        var a = state.select_msg_update;
        if (state.student_list) {
            for (var i = 0; i < state.student_list.length; i++) {
                if (state.student_list[i].user_id === state.select_student_id) {
                    return state.student_list[i];
                }
            }
        } else {
            return undefined;
        }
    },
    unread_message_count: state => {
        var count = 0;
        var a = state.unread_updata;
        for (var i = 0; i < state.unread_list.length; i++) {
            count += state.unread_list[i].count;
        }
        return count;
    }
}

// mutations
const mutations = {
    [types.MESSAGE_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.MESSAGE_STUDENT_LIST_LOADED](state, param) {
        for (var i = 0; i < param.length; i++) {
            param[i].msg = [];
            param[i].unread_count = 0;
            if (state.unread_list.length > 0) {
                for (var j = 0; j < state.unread_list.length; j++) {
                    if (param[i].user_id === state.unread_list[j].from_user_id) {
                        param[i].unread_count = state.unread_list[j].count;
                        break;
                    }
                }
            }
        }
        state.student_list = param || state.student_list;
        state.isLoading = false;
    },
    [types.MESSAGE_LIST_LOADED](state, param) {
        for (var i = 0; i < state.student_list.length; i++) {
            if (state.student_list[i].user_id === param.id) {
                state.student_list[i].msg = param.data;
                state.student_list[i].unread_count = 0;
                break;
            }
        }
        for (var j = 0; j < state.unread_list.length; j++) {
            if (state.unread_list[j].from_user_id === param.id) {
                state.unread_list[j].count = 0;
                state.unread_updata = !state.unread_updata;
                break;
            }
        }
        state.select_student_id = param.id;
    },
    [types.MESSAGE_ADDED](state, param) {
        for (var i = 0; i < state.student_list.length; i++) {
            if (state.student_list[i].user_id === param.u_id) {
                state.student_list[i].msg.push({
                    id: param.id,
                    from_user_id: param.data.from_user_id,
                    to_user_id: param.data.to_user_id,
                    content: param.data.content,
                    time: new Date()
                });
                state.select_msg_update = !state.select_msg_update;
                break;
            }
        }
    },
    [types.MESSAGE_SELECT_STUDENT_CHANGE](state, param) {
        state.select_student_id = param;
    },
    [types.UNREAD_COUNT_LOADED](state, param) {
        state.unread_list = param || state.unread_list;
        if (state.student_list.length > 0) {
            for (var i = 0; i < state.student_list.length; i++) {
                for (var j = 0; j < state.unread_list.length; j++) {
                    if (state.student_list[i].user_id === state.unread_list[j].from_user_id) {
                        state.student_list[i].unread_count = state.unread_list[j].count;
                        break;
                    }
                }
            }
        }
    },
    [types.UNREAD_COUNT_ADDED](state, param){
        var founded = false;
        var i;
        for (i = 0; i < state.unread_list.length; i++) {
            if (state.unread_list[i].form_user_id === param.from_user_id) {
                state.unread_list[i].count++;
                founded = true;
                state.unread_updata = !state.unread_updata;
                break;
            }
        }
        for(i=0;i<state.student_list.length;i++)
        {
            if (state.student_list[i].user_id === param.from_user_id) {
                state.student_list[i].unread_count ++;
                break;
            }
        }
        if (!founded) {
            state.unread_list.push({ from_user_id: param.from_user_id, count: 1 });
            state.unread_updata = !state.unread_updata;
        }
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
