/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import { get_tutor_task_list, readover } from '../../api/modules/tools_task'

const state = {
    state_list: [{id:1,name:'未上传'},{id:2,name:'未批阅'},{id:3,name:'已批阅'},{id:4,name:'未通过'},{id:-1,name:'屏蔽'}],
    isLoading:false,
    data_list:[]
}

// getters
// actions
const actions = {
    get_my_assignment_list({ commit }, params) {
        commit(types.MY_ASSIGNMENT_LOADING);
        get_tutor_task_list(params).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.MY_ASSIGNMENT_LOADED,res.data.msg);
            }
        })
    },
    readover_task({ commit }, params) {
        commit(types.MY_ASSIGNMENT_LOADING);
        readover(params.user_task_id,params.read_over_content,3).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.READOVER_TASK,params);
                params.callback.call();
            }
        })
    }
}
// mutations
const mutations = {
    [types.MY_ASSIGNMENT_LOADED](state, list) {
        state.data_list = list || state.data_list;
        state.isLoading = false;
    },
    [types.MY_ASSIGNMENT_LOADING](state) {
        state.isLoading = true;
    },
    [types.READOVER_TASK](state, data) {
        for(var i=0;i<state.data_list.length;i++)
        {
            if(state.data_list[i].user_task_id === data.user_task_id)
            {
                state.data_list.splice(i,1);
                break;
            }
        }
    }
}

export default {
    state,
    actions,
    mutations
}
