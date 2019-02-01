/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(project_id,title) {
    let id = project_id ? project_id:  +localStorage.getItem('lastSelectedProject')
    return api.post('api/tools_curriculum/get_list',{
        project_id: id,
        title:title});
}

export function add_curriculum(data) {
    return api.post('api/tools_curriculum/add_curriculum',{
        title:data.title,
        teacher_id:data.teacher_id,
        start_time:data.start_time,
        end_time:data.end_time,
        subject_id:data.subject_id,
        grade_id:data.grade_id,
        state:data.state,
        img_url_arr:data.img_url_arr,
        description:data.description,
        orderby:data.orderby,
        pre_curriculum_ids:data.pre_curriculum_ids,
        curriculum_roles:data.curriculum_roles,
        project_id:data.project_id,
        data_center_id:data.data_center_id});
}

export function update_curriculum(curriculum_id,data) {
    return api.post('api/tools_curriculum/update_curriculum',{
        curriculum_id:curriculum_id,
        title:data.title,
        teacher_id:data.teacher_id,
        start_time:data.start_time,
        end_time:data.end_time,
        subject_id:data.subject_id,
        grade_id:data.grade_id,
        state:data.state,
        img_url_arr:data.img_url_arr,
        description:data.description,
        orderby:data.orderby,
        pre_curriculum_ids:data.pre_curriculum_ids,
        curriculum_roles:data.curriculum_roles,
        data_center_id:data.data_center_id});
}

export function delete_curriculum(curriculum_id,project_id) {
    return api.post('api/tools_curriculum/delete_curriculum',{
        curriculum_id:curriculum_id});
}

export function get_detail(curriculum_id) {
    return api.post('api/tools_curriculum/get_detail',{
        curriculum_id:curriculum_id});
}

export function set_curriculum_orderby(params) {
    return api.post('api/tools_curriculum/set_curriculum_orderby',{
        params:params});
}

export function unlock_curriculum_video_test(to_user_id,curriculum_id) {
    return api.post('api/tools_curriculum/unlock_curriculum_video_test',{
        to_user_id:to_user_id,
        curriculum_id:curriculum_id});
}

export function new_version_unlock_curriculum_video_test(to_user_id,curriculum_id, product_id) {
    return api.post('api/tools_curriculum/new_version_unlock_curriculum_video_test',{
        to_user_id:to_user_id,
        curriculum_id:curriculum_id,
        product_id:product_id});
}
