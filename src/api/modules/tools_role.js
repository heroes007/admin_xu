/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list() {
    return api.post('api/tools_role/get_list',{});
}

export function set_role(user_id, role_id, set_type) {
    return api.post('api/tools_role/set_role',{user_id:user_id,role_id:role_id,set_type:set_type});
}