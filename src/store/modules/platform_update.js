import * as types from '../types'
import {
    get_all_version,
    edit_version
} from '../../api/modules/tools_version'

const state = {
    platforms: [],
    showMainLoading: false
}

const actions = {
    getPlatformList({
        commit
    }, payload) {
        commit(types.PLATFORM_UPDATE_LOADING);
        get_all_version().then(res => {
            if (res.data.res_code == 1) {
                commit(types.PLATFORM_UPDATE_LOADED, {
                    data: res.data.msg
                })
            } else {
                 alert('获取列表失败!');
                 commit(types.PLATFORM_LOADED)
            }
        });
        // commit(types.PLATFORM_UPDATE_LOADED, {data: []});
    },
    editVersion({
        commit
    }, payload) {
        commit(types.PLATFORM_UPDATE_LOADING);
        edit_version(payload).then(res => {
            if (res.data.res_code == 1) {
                commit(types.PLATFORM_EDIT_LOADED, {
                    data: payload
                })
            } else {
                alert('上传失败！请重新上传~');
                commit(types.PLATFORM_LOADED)
            }
        })
    }
}

const mutations = {
    [types.PLATFORM_UPDATE_LOADING](state, payload) {
        state.showMainLoading = true;
    },
    [types.PLATFORM_UPDATE_LOADED](state, payload) {
        state.platforms = payload.data;
        state.showMainLoading = false;
    },
    [types.PLATFORM_EDIT_LOADED](state, payload) {
        var platform_one = state.platforms.find(item => item.id == payload.data.id);
        platform_one.version = payload.data.ver;
        platform_one.platform_type = payload.data.platform_type;
        platform_one.download_url = payload.data.download_url;
        state.platforms = state.platforms;
        if(payload.data.callback){
            payload.data.callback();
        }
        state.showMainLoading = false;
    },
    [types.PLATFORM_LOADED](state, payload){
        state.showMainLoading = false;
    }
}

export default {
    state,
    actions,
    mutations
}