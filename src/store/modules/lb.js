/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import { get_list } from '../../api/modules/tools_lb'

const state = {
    lb_list: [],
    total:999,
    curPage:1,
    pageSize:10,
    isLoading:false
}

// getters
// actions
const actions = {
    get_lb_list ({ commit },param) {
        commit(types.LB_PAGE_DATA_SETTED,param)

        if((state.curPage - 1) * state.pageSize < state.total || state.lb_list.length === 0)
        {
            get_list(param.curPage - 1,param.pageSize,param.is_auto).then((res) => {
                if(res.data.res_code === 1)
                {
                    commit(types.LB_LIST_LOADED,res.data.msg);
                }
            });
        }
    }
}
// mutations
const mutations = {
    [types.LB_LIST_LOADED] (state,param) {
        state.lb_list = param.list;
        state.total = param.count;
    },
    [types.LB_PAGE_DATA_SETTED] (state, param) {
        state.curPage = param.curPage;
        state.pageSize = param.pageSize;
    }
}

export default {
    state,
    actions,
    mutations
}
