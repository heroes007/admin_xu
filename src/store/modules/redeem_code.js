
import * as types from '../types'
import api from '../../api/modules/config'
import { get_group_list, change_code_state, create_code } from '../../api/modules/tools_redeem_code'

const state = {
    code_list: [],
    isLoading: false,
    state_list:[
        {id:0,name:'不可用'},{id:1,name:'未兑换'},{id:-1,name:'已兑换'},{id:-2,name:'作废'}
    ]
}


// actions
const actions = {
    clear_store({ commit }) {
        commit(types.REDEEM_CODE_CLEAR);
    },
    change_redeem_code_valid({ commit }, param) {
        commit(types.REDEEM_CODE_SHOW_LOADING);
        change_code_state(param.id,param.value).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.CODE_VALID_UPDATED, param)
            }
        })
    },
    get_code_group_list({ commit }, param) {
        if(state.code_list.length === 0)
        {
            commit(types.REDEEM_CODE_SHOW_LOADING);
        get_group_list(param).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.REDEEM_CODE_GROUP_LOADED,res.data.msg);
            }
        })
        } 
    },
    add_code_group({ commit }, param) {
        commit(types.REDEEM_CODE_SHOW_LOADING);
        create_code(param).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.REDEEM_CODE_GROUP_ADDED,{id:res.data.msg,data:param});
                param._fn();
            }
        })
    }
}

const getters = {
    
}

// mutations
const mutations = {
    [types.REDEEM_CODE_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.CODE_VALID_UPDATED](state, param) {
        for (var i = 0; i < state.code_list.length; i++) {
            if(state.code_list[i].id === param.id)
            {
                state.code_list[i][param.key] = param.value;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.REDEEM_CODE_GROUP_LOADED](state, param) {
         for (var i = 0; i < param.length; i++) {
            param[i].is_valid = param[i].code_state === 0?false:true;
        }
        state.code_list = param || state.code_list;
        state.isLoading = false;
    },
    [types.REDEEM_CODE_GROUP_ADDED](state, param) {
        state.code_list.push({id:param.id,code_name:param.data.code_name,offline_term_count:param.offline_term_count,open_time:param.data.open_time,ex_time:param.data.ex_time,count:param.data.count,used_count:0,code_state:1,is_valid:true,param:param.data.product_id})
        state.isLoading = false;
    },
    [types.REDEEM_CODE_CLEAR](state) {
        state.code_list = [];
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
