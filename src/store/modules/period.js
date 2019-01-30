
import * as types from '../types'
import api from '../../api/modules/config'
import { get_period_list } from '../../api/modules/period'

const state = {
    period_list: [],
    msg:''
}


// actions
const actions = {
    get_period_list ({ commit }) {
        commit(types.PERIOD_LIST_LOADING)
        get_period_list().then(function (res) {
            if(res.data.res_code === 1)
            {
                commit(types.PERIOD_LIST_LOADED,res.data.msg);
            }
        });
    }
}
// mutations
const mutations = {
    [types.PERIOD_LIST_LOADED] (state,list) {
        state.period_list = list || state.period_list;
    },
    [types.PERIOD_LIST_LOADING] (state) {
        state.msg = '加载中...';
    }
}

export default {
    state,
    actions,
    mutations
}