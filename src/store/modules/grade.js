
import * as types from '../types'
import api from '../../api/modules/config'
import { get_list } from '../../api/modules/grade'

const state = {
    grade_list: [],
    is_loading_list: false
}


// actions
const actions = {
    get_grade_list({ commit }) {

        if (!state.is_loading_list && state.grade_list.length === 0) {
            // commit(types.GRADE_LIST_LOADING)
            // get_list().then(function (res) {
            //     if (res.data.res_code === 1) {
            //         // res.data.msg.unshift({id:0,name:'全学段'});
            //         commit(types.GRADE_LIST_LOADED, res.data.msg);
            //     }
            // });
        }

    }
}
// mutations
const mutations = {
    [types.GRADE_LIST_LOADED](state, list) {
        state.grade_list = list || state.grade_list;
        state.is_loading_list = false;
    },
    [types.GRADE_LIST_LOADING](state) {
        state.is_loading_list = true;
    }
}

export default {
    state,
    actions,
    mutations
}
