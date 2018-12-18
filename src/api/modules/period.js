/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_period_list() {
    return api.post('api/period/get_period_list',{});
}