/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_city() {
    return api.post('api/city/get_city',{});
}