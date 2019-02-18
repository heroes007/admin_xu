
import * as types from '../types'
import {
    get_list,
    add_product,
    update_product,
    switch_product,
    get_curriculums,
    add_curriculums,
    set_pre_curriculums,
    delete_curriculum,
    get_certificate
} from '../../api/modules/tools_product'


const state = {
    certificate_list:[],
    production_list: [],
    total:0,
    isLoading: false,
    pre_curriculum_change_guard:null,
    cur_production_id:0,
    stateList:[{id:3,name:'首页推荐'},{id:0,name:'编辑中'},{id:1,name:'正常'},{id:2,name:'不可购买'}],
    examineTypeList:[{id:0,name:'笔试和面试'},{id:1,name:'只面试'},{id:2,name:'只笔试'},{id:3,name:'免笔试面试'}]
}

// actions
const actions = {
    get_production_list({
            commit
        }, param) {
            commit(types.PRODUCTION_SHOW_LOADING);
            get_list(param).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.PRODUCTION_LIST_LOADED, res.data.msg)
                }
                if(param.callback)
                    param.callback();
            })
    },
    get_certificate_list({
             commit
         }) {
      get_certificate().then(res => {
            commit(types.PRODUCTION_CERTIGICATE, res.data);
        })
    },
    change_production_vailid({
            commit
        }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        switch_product(param.id, param.value?1:0).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_VALID_UPDATED, param)
            }
        })
    },
    change_production_state({
            commit
        }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        switch_product(param.id, param.value).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_VALID_UPDATED, param)
            }
        })
    },
    add_production({ commit }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        add_product(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_ADDED, {result:res.data.msg,data:param})
                if(param._fn)
                    param._fn();
            }
        })
    },
    update_production({ commit }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        update_product(param.product_id, param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_UPDATED, param)
                if(param._fn)
                    param._fn();
            }
        })
    },
    delete_production({ commit }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        switch_product(param.id, -1).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_DELETED, param)
                if(param._fn)
                    param._fn();
            }
        })
    },
    get_production_curriculums({ commit }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        get_curriculums(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_CURRICULUMS_LOADED, {result:res.data.msg,data:param})
            }
        })
    },
    add_production_curriculums({ commit }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        add_curriculums(param.id,param.curriculums).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_CURRICULUMS_ADDED, param)
                if(param._fn)
                    param._fn();
            }
        })
    },
    delete_production_curriculums({ commit }, param) {
        commit(types.PRODUCTION_SHOW_LOADING);
        delete_curriculum(param.id,param.curriculum_id).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_CURRICULUMS_DELETED, param);
                if(param._fn)
                    param._fn();
            }
        })
    },
    change_production_curriculum_pre_curriculum({ commit }, params) {
        console.log(params)
        if(state.pre_curriculum_change_guard && params.value.length === state.pre_curriculum_change_guard.length){
            return;
        }
        commit(types.PRODUCTION_SHOW_LOADING);
        commit(types.PRODUCTION_CHANGE_PRE_GUARD,params.value);
        set_pre_curriculums(state.cur_production_id,params.id,params.value).then(res => {
            if(res.data.res_code === 1){
                commit(types.PRODUCTION_CHANGE_PRE_CURRICULUM,params);
            }
        })
    },
    set_cur_production({ commit }, param) {
        commit(types.CUR_PRODUCTION_SETTED,param);
    }
}
// mutations
const mutations = {
    [types.PRODUCTION_CLEAR](state) {
        state.production_list = [];
    },
    [types.PRODUCTION_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.PRODUCTION_LIST_LOADED](state, param) {
        for (var i = 0; i < param.products.length; i++) {
            param.products[i].online_curriculum_list = [];
            param.products[i].offline_curriculum_list = [];
            param.products[i].is_valid = param.products[i].state === 1?true:false;
        }
        state.production_list = param.products;
        state.total = param.count;
        state.isLoading = false;
    },
    [types.PRODUCTION_CERTIGICATE](state, param) {
        state.certificate_list = param.data
        console.log(state.certificate_list)
    },
    [types.PRODUCTION_VALID_UPDATED](state, param) {
        for (var i = 0; i < state.production_list.length; i++) {
            if (state.production_list[i].id === param.id) {
                state.production_list[i][param.key] = param.value;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_ADDED](state, param) {
        state.production_list.push({id:param.result,code:param.data.code,title:param.data.title,price:param.data.price,original_price:param.data.original_price,state:0,is_valid:false})
        state.isLoading = false;
    },
    [types.PRODUCTION_UPDATED](state, param) {
        for (var i = 0; i < state.production_list.length; i++) {
            if (state.production_list[i].id === param.product_id) {
                state.production_list[i].title = param.title;
                 state.production_list[i].price = param.price;
                 state.production_list[i].original_price = param.original_price;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_DELETED](state, param) {
        for (var i = 0; i < state.production_list.length; i++) {
            if (state.production_list[i].id === param.id) {
                state.production_list.splice(i,1);
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_CURRICULUMS_LOADED](state, param) {
        for (var i = 0; i < state.production_list.length; i++) {
            if (state.production_list[i].id === param.data) {
                for(var j=0;j<param.result.length;j++)
                {
                    param.result[j].id = param.result[j].curriculum_id;
                }
                state.production_list[i].online_curriculum_list = param.result;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_CURRICULUMS_ADDED](state, param) {
        for (var i = 0; i < state.production_list.length; i++) {
            if (state.production_list[i].id === param.id) {
                for(var j=0;j<param.curriculumData.length;j++)
                {
                    state.production_list[i].online_curriculum_list.push({id:param.curriculumData[j].curriculum_id,curriculum_id:param.curriculumData[j].curriculum_id,teacher_name:param.curriculumData[j].teacher_name,title:param.curriculumData[j].title,pre_curriculums:[]});
                }
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_CURRICULUMS_DELETED](state, param) {
        for (var i = 0; i < state.production_list.length; i++) {
            if (state.production_list[i].id === param.id) {
                for(var j=0;j<state.production_list[i].online_curriculum_list.length;j++)
                {
                    if(state.production_list[i].online_curriculum_list[j].curriculum_id === param.curriculum_id)
                    {
                        state.production_list[i].online_curriculum_list.splice(j,1);
                        break;
                    }
                }
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_CHANGE_PRE_GUARD](state, param) {
        state.pre_curriculum_change_guard = param;
    },
    [types.PRODUCTION_CHANGE_PRE_CURRICULUM](state, params) {
        // for(var i = 0; i < state.production_list.length; i++)
        // {
        //     if (state.production_list[i].id === state.cur_production_id) {
        //         for(var j=0;j<state.production_list[i].online_curriculum_list.length;j++)
        //         {
        //             if(state.production_list[i].online_curriculum_list[j].curriculum_id === params.id)
        //             {
        //                 state.production_list[i].online_curriculum_list[j][params.key] = params.value.concat();
        //             }
        //             break;
        //         }
        //     }
        // }
        state.pre_curriculum_change_guard = null;
        state.isLoading = false;
    },
    [types.CUR_PRODUCTION_SETTED](state, param) {
        state.cur_production_id = param;
    }
}

export default {
    state,
    actions,
    mutations
}
