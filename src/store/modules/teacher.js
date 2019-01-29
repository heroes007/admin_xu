/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import { get_list,add_teacher,update_teacher,delete_teacher } from '../../api/modules/tools_teacher'

const state = {
    teacher_list: [],
    msg:'',
    showLoading:false
}


// actions
const actions = {
    get_teacher_list ({ commit }) {
        if(!state.showLoading && state.teacher_list.length === 0)
        {
                    commit(types.TEACHER_LIST_LOADING);
        get_list().then(function (res) {
            if(res.data.res_code === 1)
            {
                commit(types.TEACHER_LIST_LOADED,res.data.msg);
            }
        });
        }
    },
    add_teacher({ commit },params) {
        // commit(types.TEACHER_ADDING);
        add_teacher(params).then(function(res) {
            if(res.data.res_code === 1)
            {
                commit(types.TEACHER_ADDED,{result:res.data.msg,data:params});
                params._fn();
            }
        })
    },
    edit_teacher({ commit },params) {
        commit(types.TEACHER_SHOW_LOADING);
        update_teacher(params.id,params).then(function(res) {
            if(res.data.res_code === 1)
            {
                commit(types.TEACHER_EDITED,{result:params.id,data:params});
                params._fn();
            }
        })
    },
    delete_teacher({ commit },params) {
        commit(types.TEACHER_SHOW_LOADING);
        delete_teacher(params.id).then(function(res) {
            if(res.data.res_code === 1)
            {
                commit(types.TEACHER_DELETED,params);
            }
        })
    }
}
// mutations
const mutations = {
    [types.TEACHER_LIST_LOADED] (state,list) {
        state.teacher_list = list || state.teacher_list;
        state.showLoading = false;
    },
    [types.TEACHER_LIST_LOADING] (state) {
        state.showLoading = true;
        state.msg = '加载中...';
    },
    [types.TEACHER_ADDING] (state) {
        state.showLoading = true;
    },
    [types.TEACHER_ADDED] (state, params) {
        state.teacher_list.push({id:params.result,name:params.data.name,img_url:params.data.img_url})
        // state.showLoading = false;
    },
    [types.TEACHER_SHOW_LOADING] (state) {
        state.showLoading = true;
    },
    [types.TEACHER_EDITED] (state, params) {

        for(var i=0;i<state.teacher_list.length;i++)
        {
            if(state.teacher_list[i].id === params.result)
            {
                state.teacher_list[i].name = params.data.name;
                state.teacher_list[i].img_url = params.data.img_url;
                break;
            }
        }

        state.showLoading = false;
    },
    [types.TEACHER_DELETED] (state, params) {
        for(var i=0;i<state.teacher_list.length;i++)
        {
            if(state.teacher_list[i].id === params.id)
            {
                state.teacher_list.splice(i,1);
                break;
            }
        }
        state.showLoading = false;
    }
}

export default {
    state,
    actions,
    mutations
}