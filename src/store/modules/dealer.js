
import * as types from '../types'
import { get_list } from '../../api/modules/dealer'

const state = {
    dealer_list: [],
    is_loading_list: false
}


// actions
const actions = {
    get_dealer_list({ commit }) {
        if (!state.is_loading_list && state.dealer_list.length === 0) {
            commit(types.DEALER_LIST_LOADING)
            get_list().then(function (res) {
                if (res.data.res_code === 1) {
                    var list = res.data.msg;
                    list.push({id:0,company:"老用户"})
                    list.push({id:1,company:"主站"})
                    commit(types.DEALER_LIST_LOADED, list);
                }
            });
        }

    }
}
// mutations
const mutations = {
    [types.DEALER_LIST_LOADED](state, list) {
        state.dealer_list = list || state.dealer_list;
        state.is_loading_list = false;
    },
    [types.DEALER_LIST_LOADING](state) {
        state.is_loading_list = true;
    }
}

export default {
    state,
    actions,
    mutations
}
