
import * as types from '../types'
import api from '../../api/modules/config'
import { get_role } from '../../api/modules/roles'
import { get_list } from '../../api/modules/tools_role'

const state = {
    my_role: [],
    role_list: [],
    is_loading_list: false
}


// actions
const actions = {
    get_role({ commit }) {
        if (!state.is_loading_list && state.role_list.length === 0) {
            get_role().then((res) => {
                if (res.data.res_code === 1) {

                    var roleList = JSON.parse(res.data.msg.role_id);

                    commit(types.ROLE_LOADING, roleList);
                }
                else {
                    commit(types.ROLE_LOADED, []);
                }
            });
        }

    },
    get_role_list({ commit }) {
        if (!state.is_loading_list && state.role_list.length === 0) {
            get_list().then((res) => {
                if (res.data.res_code === 1) {
                    res.data.msg.unshift({ role_id: 0, role_name: '普通用户', category_id: 0, category_name: '' });

                    var roleList = res.data.msg;

                    commit(types.ROLE_LIST_LOADED, roleList);
                }
                else {
                    commit(types.ROLE_LIST_LOADED, []);
                }
            });
        }
    }
}
// mutations
const mutations = {
    [types.ROLE_LOADED](state, list) {
        state.my_role = list || state.my_role;
    },
    [types.ROLE_LIST_LOADING](state) {
        state.is_loading_list = true;
    },
    [types.ROLE_LIST_LOADED](state, list) {
        state.role_list = list || state.role_list;
        state.is_loading_list = false;
    }
}

export default {
    state,
    actions,
    mutations
}
