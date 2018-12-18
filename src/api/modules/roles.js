/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_role() {
    return api.post('api/role/get_role',{});
}