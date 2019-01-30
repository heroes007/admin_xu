
import * as types from '../types'
import {
    get_project_list
} from '../../api/modules/tools_project'


const state = {
    select_project_id: 0,
    project_list: [],
    offline_project_id: '',
    online_project_id: '',
    task_project_id: '',
    isLoading: false
}

// actions

const getters = {
    select_project_type: state => {
        if (state.project_list) {
            for (var i = 0; i < state.project_list.length; i++) {
                if (state.project_list[i].id === state.select_project_id) {
                    return state.project_list[i].type;
                }
            }
        } else {
            return undefined;
        }
    },
}

const actions = {
    get_project_list({
        commit
    }, payload) {
        commit(types.PROJECT_LIST_LOADING, true);
        if (state.project_list.length === 0) {
            get_project_list().then(res => {
                if (res.data.res_code === 1 && res.data.msg.length > 0) {
                    commit(types.QUERY_PROJECT_LIST, {
                        data: res.data.msg,
                        callback: payload ? payload.callback : null
                    })
                }
            })
        } else {
            commit(types.PROJECT_LIST_LOADING, false)
        }
    },
    change_selected_project_id({
        commit
    }, param) {
        commit(types.CHANGE_SELECTED_PROEJCT_ID, param)
    },
    save_static_online_project_id({
        commit
    }, param) {
        commit(types.SAVE_STATIC_ONLINE_PROJECT_ID, param)
    },
    save_static_offline_project_id({
        commit
    }, param) {
        commit(types.SAVE_STATIC_OFFLINE_PROJECT_ID, param)
    },
    save_static_task_project_id({
        commit
    }, param) {
        commit(types.SAVE_STATIC_TASK_PROJECT_ID, param)
    }
}
// mutations
const mutations = {
    [types.PROJECT_LIST_LOADING](state, payload) {
        state.isLoading = payload;
    },
    [types.QUERY_PROJECT_LIST](state, payload) {
        state.project_list = payload.data;
        if (payload.callback) payload.callback(state.select_project_id);
        state.isLoading = false;
    },
    [types.CHANGE_SELECTED_PROEJCT_ID](state, payload) {
        state.select_project_id = payload;
    },
    [types.SAVE_STATIC_ONLINE_PROJECT_ID](state, payload) {
        state.online_project_id = payload
    },
    [types.SAVE_STATIC_OFFLINE_PROJECT_ID](state, payload) {
        state.offline_project_id = payload
    },
    [types.SAVE_STATIC_TASK_PROJECT_ID](state, payload) {
        state.task_project_id = payload
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}