
import * as types from '../types'
import api from '../../api/modules/config'

const state = {
    message: ''
}


// actions
const actions = {
    get_message ({ commit }) {
        commit(types.TEST_MESSAGE_LOADING);
        api.get('api/hello').then(function (res) {
            commit(types.TEST_MESSAGE_LOADED,res.data.hello);
        });
    }
}
// mutations
const mutations = {
    [types.TEST_MESSAGE_LOADING] (state) {
        state.message = "请求中...";
    },
    [types.TEST_MESSAGE_LOADED] (state,message) {
        state.message = message || state.message;
    }
}

export default {
    state,
    actions,
    mutations
}