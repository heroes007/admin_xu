/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import {
    get_production_group_list,
    add_special,
    update_special,
    switch_special,
    get_products,
    add_products
} from '../../api/modules/tools_special'


const state = {
    production_group_list: [],
    totalCount:0,
    isLoading: false
}
// getters
// actions
const actions = {
    get_production_group_list({
            commit
        }, param) {
            commit(types.PRODUCTION_GROUP_SHOW_LOADING);
            get_production_group_list(param).then(res => {
                if (res.data.res_code === 1 && res.data.msg.specials.length > 0) {
                    commit(types.PRODUCTION_GROUP_LIST_LOADED, res.data.msg)
                }
                if(param.callback)
                    param.callback();
            })
    },
    change_production_group_vailid({
            commit
        }, param) {
        // commit(types.PRODUCTION_GROUP_SHOW_LOADING);
        switch_special(param.id, param.value?1:0).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_GROUP_VALID_UPDATED, param)
            }
        })
    },
    add_production_group({ commit }, param) {
        commit(types.PRODUCTION_GROUP_SHOW_LOADING);
        add_special(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_GROUP_ADDED, {result:res.data.msg,data:param})
                if(param._fn)
                    param._fn();
            }
        })
    },
    update_production_group({ commit }, param) {
        commit(types.PRODUCTION_GROUP_SHOW_LOADING);
        update_special(param.special_id, param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_GROUP_UPDATED, param)
                if(param._fn)
                    param._fn();
            }
        })
    },
    delete_production_group({ commit }, param) {
        commit(types.PRODUCTION_GROUP_SHOW_LOADING);
        switch_special(param.id, -1).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_GROUP_DELETED, param)
                if(param._fn)
                    param._fn();
            }
        })
    },
    get_production_group_products({ commit }, param) {
        commit(types.PRODUCTION_GROUP_SHOW_LOADING);
        get_products(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_GROUP_PRODUCTS_LOADED, {result:res.data.msg,data:param})
            }
        })
    },
    add_production_group_products({ commit }, param) {
        commit(types.PRODUCTION_GROUP_SHOW_LOADING);
        add_products(param.id,param.products).then(res => {
            if (res.data.res_code === 1) {
                commit(types.PRODUCTION_GROUP_PRODUCTS_ADDED, param)
                if(param._fn)
                    param._fn();
            }
        })
    }
}
// mutations
const mutations = {
    [types.PRODUCTION_GROUP_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.PRODUCTION_GROUP_LIST_LOADED](state, param) {
        for (var i = 0; i < param.specials.length; i++) {
            param.specials[i].id = param.specials[i].special_id;
            param.specials[i].is_valid = param.specials[i].state === 1?true:false;
            param.specials[i].products = [];
        }
        state.production_group_list = param.specials;
        state.totalCount = param.count;
        state.isLoading = false;
    },
    [types.PRODUCTION_GROUP_VALID_UPDATED](state, param) {
        for (var i = 0; i < state.production_group_list.length; i++) {
            if (state.production_group_list[i].id === param.id) {
                state.production_group_list[i][param.key] = param.value;
                break;
            }
        }
       if(state.isLoading) state.isLoading = false;
    },
    [types.PRODUCTION_GROUP_ADDED](state, param) {
        state.production_group_list.push({id:param.result,special_id:param.result,name:param.data.name,state:0,is_valid:false,product_count:0})
        state.isLoading = false;
    },
    [types.PRODUCTION_GROUP_UPDATED](state, param) {
        for (var i = 0; i < state.production_group_list.length; i++) {
            if (state.production_group_list[i].special_id === param.special_id) {
                state.production_group_list[i].name = param.name;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_GROUP_DELETED](state, param) {
        for (var i = 0; i < state.production_group_list.length; i++) {
            if (state.production_group_list[i].special_id === param.id) {
                state.production_group_list.splice(i,1);
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_GROUP_PRODUCTS_LOADED](state, param) {
        for (var i = 0; i < state.production_group_list.length; i++) {
            if (state.production_group_list[i].id === param.data) {
                state.production_group_list[i].products = param.result;
                break;
            }
        }
        state.isLoading = false;
    },
    [types.PRODUCTION_GROUP_PRODUCTS_ADDED](state, param) {
        for (var i = 0; i < state.production_group_list.length; i++) {
            if (state.production_group_list[i].id === param.id) {
                state.production_group_list[i].product_count = param.productData.length;
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
