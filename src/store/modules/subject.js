
import * as types from '../types'
import api from '../../api/modules/config'
import { get_list } from '../../api/modules/subject'

const state = {
    subject_list: [],
    is_loading_list: false
}


// actions
const actions = {
    get_subject_list({ commit }) {
        // if (!state.is_loading_list && state.subject_list.length === 0) {
        //     commit(types.SUBJECT_LIST_LOADING)
        //     get_list().then(function (res) {
        //         if (res.data.res_code === 1) {
        //             // res.data.msg.unshift({id:0,name:'全学科'});
        //             commit(types.SUBJECT_LIST_LOADED, res.data.msg);
        //         }
        //     });
        // }

    }
}
// mutations
const mutations = {
    [types.SUBJECT_LIST_LOADED](state, list) {
        state.subject_list = list || state.subject_list;
        state.is_loading_list = false;
    },
    [types.SUBJECT_LIST_LOADING](state) {
        state.is_loading_list = true;
    }
}

export default {
    state,
    actions,
    mutations
}
