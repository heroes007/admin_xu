/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(offline_term_id,phone,name) {
    return api.post('api/offline_term_receipt/get_list',{offline_term_id:offline_term_id,phone:phone,name:name});
}

export function update_receipt(otr_id,data) {
    return api.post('api/offline_term_receipt/update_receipt',{
        otr_id:otr_id,
        name:data.name,
        sex:data.sex,
        idcard:data.idcard,
        phone:data.phone,
        email:data.email,
        estimate_set_out_city_id:data.estimate_set_out_city_id,
        estimate_set_out_province_id:data.estimate_set_out_province_id,
        estimate_set_out_time:data.estimate_set_out_time
    });
}