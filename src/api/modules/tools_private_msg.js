/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(to_user_id) {
    return api.post('api/private_msg/get_list',{to_user_id:to_user_id});
}

export function get_student_list(project_id) {
    return api.post('api/tools_private_msg/get_student_list',{project_id:project_id});
}

export function send(to_user_id,content) {
    return api.post('api/private_msg/send',{to_user_id:to_user_id,content:content});
}

export function get_unread_num_grp_user() {
    return api.post('api/tools_private_msg/get_unread_num_grp_user');
}



