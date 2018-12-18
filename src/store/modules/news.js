/**
 * Created by lesonli on 2016/11/17.
 */
import * as types from '../types'
import api from '../../api/modules/config'
import { get_list, add_news, update_news } from '../../api/modules/tools_news'
import Vue from 'vue'

const state = {
    news_list: [],
    total: 1,
    isLoading: false,
    state_list: [{ id: -1, name: '全部' }, { id: 0, name: '停用' }, { id: 1, name: '启用' }]
}

// getters
// actions
const actions = {
    get_news_list({ commit }, param) {
        commit(types.NEWS_SHOW_LOADING, param)
            get_list(param).then(res => {
                if (res.data.res_code === 1) {
                    commit(types.NEWS_LIST_LOADED, res.data.msg);
                }
            });
    },
    add_news({ commit }, param) {
        commit(types.NEWS_SHOW_LOADING, param);
        add_news(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.NEWS_ADDED, { result: res.data.msg, data: param });

            if (param._fn)
                param._fn();
            }
        })
    },
    update_news({ commit }, param) {
        commit(types.NEWS_SHOW_LOADING, param);
        update_news(param).then(res => {
            if (res.data.res_code === 1) {
                commit(types.NEWS_UPDATED, param);
                            if (param._fn)
                param._fn();
            }
        })
    },
    delete_news({ commit }, param) {
        commit(types.NEWS_SHOW_LOADING, param);
        update_news({news_id:param.id,state:-1}).then(res => {
            if (res.data.res_code === 1) {
                commit(types.NEWS_DELETED, param.id);
            }
            if (param._fn)
                param._fn();
        })


    },
    change_news_valid({ commit }, param) {
        commit(types.NEWS_SHOW_LOADING, param);
        var data = {news_id:param.id,state:param.value?1:0}
        update_news(data).then(res => {
            if (res.data.res_code === 1) {
                commit(types.NEWS_UPDATED, param);
                            if (param._fn)
                param._fn();
            }
        })
    }
}
// mutations
const mutations = {
    [types.NEWS_LIST_LOADED](state, param) {
        for (var i = 0; i < param.list.length; i++) {
            param.list[i].is_valid = param.list[i].state === 0 ? false : true;
            param.list[i].updateStr = '';
        }
        state.news_list = param.list;
        state.total = param.count;
        state.isLoading = false;
    },
    [types.NEWS_SHOW_LOADING](state) {
        state.isLoading = true;
    },
    [types.NEWS_ADDED](state, param) {
        param.data.id = param.result;
        param.data.count = 0;
        param.data.create_time = new Date();
        state.news_list.unshift(param.data);
        state.isLoading = false;
    },
    [types.NEWS_UPDATED](state, param) {
        for (var i = 0; i < state.news_list.length; i++) {
            if (state.news_list[i].id === param.id) {
                if (!param.hasOwnProperty('value')) {
                    for (var p in param) {
                        if (state.news_list[i].hasOwnProperty(p)) {
                            state.news_list[i][p] = param[p]
                        }
                    }
                }
                else {
                    state.news_list[i].state = param.value ? 1 : 0;
                    state.news_list[i][param.key] = param.value;
                }
                break;
            }
        }
        state.isLoading = false;
    },
    [types.NEWS_DELETED](state, param) {
        for (var i = 0; i < state.news_list.length; i++) {
            if (state.news_list[i].id === param) {
                state.news_list.splice(i, 1);
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
