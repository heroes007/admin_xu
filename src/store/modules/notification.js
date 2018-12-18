/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import {
    add_sys_msg,
    update_sys_msg,
    delete_sys_msg,
    get_list
} from '../../api/modules/tools_sys_msg.js'

const state = {
    notification_list: [
    ],
    isLoading:false
}

// getters
// actions
const actions = {
    modify_notification_need_limit({ commit }, param) {
        commit(types.MODIFY_NOTIFICATION_NEED_LIMIT,param);
    },
    modify_notification_show_all({ commit },param) {
        commit(types.MODIFY_NOTIFICATION_SHOW_ALL,param);
    },
    get_notification_list({ commit }, param) {
        commit(types.NOTIFICATION_SHOW_LOADING);
        get_list().then(res => {
            if(res.data.res_code === 1)
            {
                 commit(types.NOTIFICATION_LIST_LOADED,res.data.msg);
            }
        })
    },
    add_notification({ commit }, param) {
        commit(types.NOTIFICATION_SHOW_LOADING);
        add_sys_msg(param).then(res => {
            if(res.data.res_code === 1)
            {
                 commit(types.NOTIFICATION_ADDED,{data:param,id:res.data.msg});
                 param.fn();
            }
        })
    },
    update_notification({ commit }, param) {
        commit(types.NOTIFICATION_SHOW_LOADING);
        update_sys_msg(param).then(res => {
            if(res.data.res_code === 1)
            {
                 commit(types.NOTIFICATION_UPDATED,param);
                 param.fn();
            }
        })
    },
    delete_notification({ commit }, param) {
        commit(types.NOTIFICATION_SHOW_LOADING);
        delete_sys_msg(param).then(res => {
            if(res.data.res_code === 1)
            {
                 commit(types.NOTIFICATION_DELETED,param);
            }
        })
    }
}
// mutations
const mutations = {
    [types.MODIFY_NOTIFICATION_NEED_LIMIT] (state,param) {
       for(var i=0;i<state.notification_list.length;i++)
       {
           if(state.notification_list[i].id === param.id)
           {
               state.notification_list[i].needLimit = param.needLimit;
               break;
           }
       }
    },
    [types.MODIFY_NOTIFICATION_SHOW_ALL] (state, param) {
        for(var i=0;i<state.notification_list.length;i++)
       {
           if(state.notification_list[i].id === param.id)
           {
               state.notification_list[i].showAll = param.showAll;
               break;
           }
       }
    },
    [types.NOTIFICATION_SHOW_LOADING] (state) {
        state.isLoading = true;
    },
    [types.NOTIFICATION_LIST_LOADED] (state, param) {
        state.notification_list = param || state.notification_list;
        state.isLoading = false;
    },
    [types.NOTIFICATION_ADDED] (state,param){
        state.notification_list.unshift({id:param.id,content:param.data.content,create_time:new Date()});
        state.isLoading = false;
    },
    [types.NOTIFICATION_UPDATED] (state,param){
        for(var i=0;i<state.notification_list.length;i++)
        {
            if(state.notification_list[i].id === param.id)
            {
                state.notification_list[i].content = param.content;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.NOTIFICATION_DELETED] (state,param){
        for(var i=0;i<state.notification_list.length;i++)
        {
            if(state.notification_list[i].id === param)
            {
                state.notification_list.splice(i,1);
                break;
            }
        }
        state.isLoading = false;
    }
}

export default {
    state,
    actions,
    mutations
}
