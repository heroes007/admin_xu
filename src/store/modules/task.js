
import * as types from '../types'
import api from '../../api/modules/config'
import {
    get_category_list,
    create_category,
    edit_category_by_id,
    delete_category_by_id,
    get_tasklist_by_cid,
    create_task,
    edit_task,
    delete_task_by_id,
    get_userlist_by_tid,
    get_curriculumlist_online
} from '../../api/modules/tools_task'

const state = {
    task_category_list: [],
    showLoading: false,
    total: null,
    activityTypeList: [{
        id: 1,
        name: '手动发送'
    }, {
        id: 2,
        name: '定时发送'
    }, {
        id: 3,
        name: '前置课发送'
    }],
    task_user_list: [],
    total_num: 0,
    cur_page: 1,
    page_size: 10,
    catch_every_page: {},
    curricum_list:[],
    homworkId:'',
    // activityTypeList:[{type:"online",name:'线上课'},{type:"underline",name:'线下课'}]
}
var catch_cid = ''

// actions
const actions = {
        get_task_category_list({ commit }, params) {
            commit(types.TASK_SHOW_LOADING);
            get_category_list(params.page, params.keyword).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CATEGORY_LIST_LOADED, res.data.data);
                }
            }),
            get_curriculumlist_online().then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CURRICUMLIST,{
                        result:res.data.data.data
                    })
                }
            })
        },
        get_curriculumlist_list({commit},params){
            get_curriculumlist_online(params).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CURRICUMLIST,{
                        result:res.data.data.data
                    })
                }
            })
        },
        add_task_category({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);
            create_category(params).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CATEGORY_ADDED, {
                        result: res.data.msg,
                        data: params
                    });
                    // window.location.reload()
                }else{
                    alert(res.msg)
                }
            })
        },
        edit_task_category({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);
            edit_category_by_id(state.homworkId, params).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CATEGORY_EDITED, params);
                    // params._fn();
                    window.location.reload()
                }
            })
        },
        delete_task_category({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);

            delete_category_by_id(params.task_category_id).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_CATEGORY_DELETED, params);
                }
            })
        },
        get_task_list({ commit }, params) {
            commit(types.TASK_SHOW_LOADING);
            catch_cid = params.task_category_id
            // get_tasklist_by_cid(params.task_category_id).then(res => {
            //     if (res.data.res_code === 1) {
            //         commit(types.TASK_LIST_LOADED, {
            //             task_category_id: params.task_category_id,
            //             result: res.data.msg
            //         });
            //     }
            // })
        },
        add_task({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);
            create_task(params.task_category_id, params).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.TASK_ADDED, {
                        data: params,
                        result: res.data.msg
                    });
                    params.callback.call();

                }
            })
        },
        edit_task({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);

            edit_task(params.task_id, params).then(res => {
             
                
                if (res.data.res_code === 1) {
                    commit(types.TASK_EDITED, params);
                    params.callback.call();
                }
            })
        },
        delete_task({
            commit
        }, params) {
            commit(types.TASK_SHOW_LOADING);
            delete_task_by_id(params).then(res => {    
                // console.log(res);            
                if (res.data.res_code === 1) {
                    commit(types.TASK_DELETED, params);
                }
            })
        },
        get_userlist_by_tid({commit,state}, params){
          commit(types.TASK_SHOW_LOADING);
          if(!state.catch_every_page[params.page_index]){
            get_userlist_by_tid(params.task_id, params.project_id, params.grade_id, params.subject_id, params.page_size, params.page_index, params.phone, params.username, params.realname, params.userid).then(res => {
              commit(types.TASK_USERLIST_TY_TID, {total: '', task_id: params.task_id, data: res.data.msg});
            });
          } else {
            commit(types.TASK_USERLIST_TY_TID, state.catch_every_page[params.page_index]);
          }
        },
        change_homework_id({commit},params){
            commit(types.TASK_CHANGE_HOMEID,params)
        }
    }
    // mutations
const mutations = {
    [types.TASK_SHOW_LOADING](state) {
        state.showLoading = true;
    },
    [types.TASK_CATEGORY_LIST_LOADED](state, params) {
        console.log(params,'aaaaaaaaaaaa')
        state.total = params.count
        // let first = {
        //     id:0,
        //     name:"未选择",
        //     orderby:0,
        //     task_list:[],
        //     type:0
        // }
        // for (var i = 0; i < params.length; i++) {
        //     params[i].task_list = [];
        // }
        // params.unshift(first);

        for (let i = 0; i < params.data.length; i++) {
            if (params.data[i].type == "online") {
                params.data[i].type = "线上课"
            }else{
                params.data[i].type = "线下课"
            }
        }

        state.task_category_list = params.data || state.task_category_list;
        state.showLoading = false;
    },
    [types.TASK_CATEGORY_ADDED](state, params) {
        state.task_category_list.push({
            // id: params.result,
            // name: params.data.name,
            // type: params.data.type,
            // task_list: []
            title:params.data.realname,
            curriculum_title:params.data.binding_course,
            type:params.data.jurisdiction
        });
        state.showLoading = false;
    },
    [types.TASK_CATEGORY_EDITED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === state.homworkId) {
                state.task_category_list[i].title = params.realname;
                state.task_category_list[i].curriculum_title = params.binding_course;
                state.task_category_list[i].type = params.jurisdiction;
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_CATEGORY_DELETED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params.task_category_id) {
                state.task_category_list.splice(i, 1);
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_LIST_LOADED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params.task_category_id) {
                state.task_category_list[i].task_list = params.result;
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_ADDED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params.data.task_category_id) {
                state.task_category_list[i].task_list.unshift({
                    id: params.result,
                    name: params.data.name,
                    grade_id: params.data.grade_id,
                    subject_id: params.data.subject_id,
                    activity_type: params.data.activity_type,
                    create_time: new Date().getTime()
                });
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_EDITED](state, params) {
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params) {
                for (var j = 0; j < state.task_category_list[i].task_list.length; j++) {
                    if (state.task_category_list[i].task_list[j].id === params.task_id) {
                        state.task_category_list[i].task_list[j].name = params.name;
                        //state.task_category_list[i].task_list[j].grade_id = params.grade_id;
                        //state.task_category_list[i].task_list[j].subject_id = params.subject_id;
                        //state.task_category_list[i].task_list[j].activity_type = params.activity_type;
                        break;
                    }
                }
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_DELETED](state, params) {
        console.log(state.task_category_list);
        
        for (var i = 0; i < state.task_category_list.length; i++) {
            if (state.task_category_list[i].id === params) {
                // for (var j = 0; j < state.task_category_list[i].task_list.length; j++) {
                //     if (state.task_category_list[i].task_list[j].id === params.task_id) {
                //         state.task_category_list[i].task_list.splice(j, 1);
                //         break;
                //     }
                // }
                state.task_category_list.splice(i, 1);
                break;
            }
        }
        state.showLoading = false;
    },
    [types.TASK_USERLIST_TY_TID](state, params){
      state.task_user_list = params.data.list;
      state.catch_every_page[params.task_id] = params.data.list;
      state.total_num = params.data.count;
      state.showLoading = false;
    },
    [types.TASK_CURRICUMLIST](state, params){
        state.curricum_list = params.result
    },
    [types.TASK_CHANGE_HOMEID](state, params){
        state.homworkId = params
    }
}

export default {
    state,
    actions,
    mutations
}
