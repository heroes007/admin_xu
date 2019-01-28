/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import { get_city } from '../../api/modules/city'

const state = {
    city_list: [],
    is_loading_list: false
}

// getters
// actions
const actions = {
    get_city_list({ commit }) {

        if (!state.is_loading_list && state.city_list.length === 0) {
            commit(types.CITY_LIST_LOADING)
            get_city().then(function (res) {
                if (res.data.res_code === 1) {
                    // res.data.msg.unshift({id:0,name:'全学段'});
                    commit(types.CITY_LIST_LOADED, res.data.msg);
                }
            });
        }
    }
}
// mutations
const mutations = {
    [types.CITY_LIST_LOADED](state, list) {
        state.city_list = list || state.grade_list;
        state.is_loading_list = false;
    },
    [types.CITY_LIST_LOADING](state) {
        state.is_loading_list = true;
    }
}

export default {
    state,
    actions,
    mutations
}
