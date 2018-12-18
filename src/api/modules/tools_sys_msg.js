/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list() {
    return api.post('api/tools_sys_msg/get_list',{});
}

export function add_sys_msg(params) {
    return api.post('api/tools_sys_msg/add_sys_msg',{title:params.title,content:params.content});
}

export function update_sys_msg(params) {
    return api.post('api/tools_sys_msg/update_sys_msg',{sys_msg_id:params.id,title:params.title,content:params.content});
}

export function delete_sys_msg(sys_msg_id) {
    return api.post('api/tools_sys_msg/delete_sys_msg',{sys_msg_id:sys_msg_id});
}

export function send_by_project_id(project_id,sys_msg_id) {
    return api.post('api/tools_sys_msg/send_by_project_id',{project_id:project_id,sys_msg_id:sys_msg_id});
}

export function send_to_all_student(sys_msg_id) {
    return api.post('api/tools_sys_msg/send_to_all_student',{sys_msg_id:sys_msg_id});
}

export function send_to_all_user(sys_msg_id) {
    return api.post('api/tools_sys_msg/send_to_all_user',{sys_msg_id:sys_msg_id});
}

