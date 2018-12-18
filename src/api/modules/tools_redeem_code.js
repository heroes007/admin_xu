/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_group_list(project_id) {
    return api.post('api/tools_redeem_code/get_group_list',{project_id:project_id});
}

export function get_list_by_group(code_group_id,page_index,page_size) {
    return api.post('api/tools_redeem_code/get_list_by_group',{code_group_id:code_group_id,page_index:page_index,page_size:page_size});
}

export function create_code(params) {
    return api.post('api/tools_redeem_code/create_code',
    {
        project_id:params.project_id,
        code_name:params.code_name,
        open_time:params.open_time,
        ex_time:params.ex_time,
        count:params.count,
        offline_term_count:params.offline_term_count,
        product_id:params.product_id
    });
}

export function change_code_state(code_group_id,code_state) {
    return api.post('api/tools_redeem_code/change_code_state',{code_group_id:code_group_id,code_state:code_state});
}

export function query_code(code) {
    return api.post('api/tools_redeem_code/query_code',{code:code});
}

