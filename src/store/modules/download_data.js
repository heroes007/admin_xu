import * as types from '../types'
import api from '../../api/modules/config'
import { get_curriculum_data_center, get_public_data_center, add_data_center, delete_data_center, set_data_center_pre_curriculums, change_data_center_enable } from '../../api/modules/tools_data_center'

const state = {
    course_download_data_list: [],
    public_download_data_list:[],
    isLoading:false,
    pre_curriculum_change_guard:null
}

const actions = {
    get_public_donwload_data_list({ commit }, params)
    {
        commit(types.DOWNLOAD_SHOW_LOADING);
        get_public_data_center(params.project_id).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.PUBLIC_DOWNLOAD_LIST_LOADED,res.data.msg);
            }
        })
    },
    get_curriculum_donwload_data_list({ commit }, params)
    {
        commit(types.DOWNLOAD_SHOW_LOADING);
        get_curriculum_data_center(params.project_id).then(res => {
            if(res.data.res_code === 1)
            {                
                commit(types.CURRICULUM_DOWNLOAD_LIST_LOADED,res.data.data.data);
            }
        })
    },
    change_course_download_data_pre_curriculum({ commit }, params) {
        if(state.pre_curriculum_change_guard && params.value.length === state.pre_curriculum_change_guard.length){ return }
        commit(types.DOWNLOAD_SHOW_LOADING);
        commit(types.SET_DOWNLOAD_CHANGE_PRE_GUARD,params.value);
        set_data_center_pre_curriculums(params.id,params.value).then(res => {
            if(res.data.res_code === 1){
                commit(types.DOWNLOAD_CHANGE_PRE_CURRICULUM,params);
            }
        })
    },
    change_public_download_data_valid({ commit }, params) {
        // commit(types.DOWNLOAD_SHOW_LOADING);
        change_data_center_enable(params.id,params.value?1:0).then(res => {
            if(res.data.res_code === 1) commit(types.DOWNLOAD_DATA_VALID_UPDATED, params)
        })
    },
    add_course_download_data({ commit }, params) {
        commit(types.DOWNLOAD_SHOW_LOADING);
        add_data_center(params).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.COURSE_DOWNLOAD_DATA_ADDED, {id:res.data.msg,data:params})
                params._fn(res.data.msg);
            }
        })
    },
    add_public_download_data({ commit }, params) {
        commit(types.DOWNLOAD_SHOW_LOADING);
        add_data_center(params).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.PUBLIC_DOWNLOAD_DATA_ADDED, {id:res.data.msg,data:params})
                params._fn();
            }
        })
    },
    delete_download_data({ commit },params) {
        commit(types.DOWNLOAD_SHOW_LOADING);
        delete_data_center(params).then(res => {
            if(res.data.res_code === 1)
            {
                commit(types.DOWNLOAD_DATA_DELETED, params)
            }
        })
    }
}
// mutations
const mutations = {
    [types.DOWNLOAD_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.SET_DOWNLOAD_CHANGE_PRE_GUARD](state, param) {
        state.pre_curriculum_change_guard = param;
    },
    [types.PUBLIC_DOWNLOAD_LIST_LOADED](state, param) {
        for (var i = 0; i < param.length; i++) {
            param[i].is_valid = param[i].state === 0?false:true;
        }
        state.public_download_data_list = param || state.public_download_data_list;
        state.isLoading = false;
    },
    [types.CURRICULUM_DOWNLOAD_LIST_LOADED](state, param) {
        console.log(param);
        // for (var i = 0; i < param.length; i++) {
        //     param[i].is_valid = param[i].state === 0?false:true;
        // }
        // state.course_download_data_list = param || state.course_download_data_list;
        state.course_download_data_list = param;
        state.isLoading = false;
    },
    [types.DOWNLOAD_CHANGE_PRE_CURRICULUM](state, params) {
        // for(var i=0;i<state.course_download_data_list.length;i++)
        // {
        //     if(state.course_download_data_list[i].id === params.id)
        //     {
        //         state.course_download_data_list[i][params.key] = params.value.concat();
        //         break;
        //     }
        // }
        state.pre_curriculum_change_guard = null;
        state.isLoading = false;
    },
    [types.DOWNLOAD_DATA_VALID_UPDATED](state, params) {
        var found = false;
        var i;
        for (i = 0; i < state.course_download_data_list.length; i++) {
            if(state.course_download_data_list[i].id === params.id){
                state.course_download_data_list[i][params.key] = params.value;
                found = true;
                break;
            }
        }
        if(!found){
            for (i = 0; i < state.public_download_data_list.length; i++) {
                if(state.public_download_data_list[i].id === params.id){
                    state.public_download_data_list[i][params.key] = params.value;
                    break;
                }
            }
        }
        // if(state.isLoading) state.isLoading = false;
    },
    [types.COURSE_DOWNLOAD_DATA_ADDED](state, param) {
       state.course_download_data_list.push({
           id:param.id,
           name:param.data.name,
           download_url:param.data.download_url,
           state:1,
           pre_curriculum:[]
       });
       state.isLoading = false;
    },
    [types.PUBLIC_DOWNLOAD_DATA_ADDED](state, param) {
       state.public_download_data_list.push({
           id:param.id,
           name:param.data.name,
           download_url:param.data.download_url,
           state:1,
           grade_id:param.data.grade_id,
           subject_id:param.data.subject_id
       });
       state.isLoading = false;
    },
    [types.DOWNLOAD_DATA_DELETED](state, param) {
        var found = false;
        var i;
        for (i = 0; i < state.course_download_data_list.length; i++) {
            if(state.course_download_data_list[i].id === param)
            {
                state.course_download_data_list.splice(i,1);
                found = true;
                break;
            }
        }
        if(!found)
        {
            for (i = 0; i < state.public_download_data_list.length; i++) {
            if(state.public_download_data_list[i].id === param)
            {
                state.public_download_data_list.splice(i,1);
                break;
            }
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
