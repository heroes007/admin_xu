/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list() {
    return api.post('api/tools_teacher/get_list',{});
}

export function add_teacher(data) {
    return api.post('api/tools_teacher/add_teacher',{
        name:data.name,
        img_url:data.img_url,
        description:data.description});
}

export function update_teacher(teacher_id,data) {
    return api.post('api/tools_teacher/update_teacher',{
        teacher_id:teacher_id,
        name:data.name,
        img_url:data.img_url,
        description:data.description});
}

export function delete_teacher(teacher_id) {
    return api.post('api/tools_teacher/delete_teacher',{
        teacher_id:teacher_id});
}

export function get_detail(teacher_id) {
    return api.post('api/tools_teacher/get_detail',{
        teacher_id:teacher_id});
}