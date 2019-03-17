/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function set_catalog_orderby(params) {
    return api.post('api/tools_curriculum_catalog/set_catalog_orderby',{
        params:params
    });
}

export function delete_catalog(catalog_id) {
    return api.post('api/tools_curriculum_catalog/delete_catalog',{
        catalog_id:catalog_id
    });
}

export function get_catalog(curriculum_online_id) {
    return api.post('product/curriculum_online_catalog/get_list',{
        curriculum_online_id:curriculum_online_id
    });
}