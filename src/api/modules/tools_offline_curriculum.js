/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_offline_curriculum_list(offline_term_id) {
    return api.post('api/tools_offline_curriculum/get_offline_curriculum_list',{
        offline_term_id:offline_term_id});
}

export function add_offline_curriculum(data) {
    return api.post('api/tools_offline_curriculum/add_offline_curriculum',{
        offline_term_id:data.offline_term_id,
        title:data.title,
        type:data.type,
        start_time:data.start_time,
        end_time:data.end_time,
        teacher_name:data.teacher_name,
        teacher_id:data.teacher_id,
        teacher_img_url:data.teacher_img_url,
        teacher_description:data.teacher_description,
        description:data.description});
}

export function update_offline_curriculum(data) {
    return api.post('api/tools_offline_curriculum/update_offline_curriculum',{
        offline_term_id:data.offline_term_id,
        curriculum_id:data.curriculum_id,
        title:data.title,
        type:data.type,
        start_time:data.start_time,
        end_time:data.end_time,
        teacher_name:data.teacher_name,
        teacher_id:data.teacher_id,
        teacher_img_url:data.teacher_img_url,
        teacher_description:data.teacher_description,
        description:data.description});
}

export function delete_offline_curriculum(curriculum_id) {
    return api.post('api/tools_offline_curriculum/delete_offline_curriculum',{
        curriculum_id:curriculum_id});
}

export function get_offline_term_list(project_id,last_count) {
    return api.post('api/tools_offline_curriculum/get_offline_term_list',{
        project_id:project_id,
        last_count:last_count});
}

export function add_offline_term(project_id,data) {
    return api.post('api/tools_offline_curriculum/add_offline_term',{
        project_id:project_id,
        name:data.name,
        level:data.level,
        description:data.description,
        start_time:data.start_time,
        end_time:data.end_time,
        ex_time:data.ex_time});
}

export function update_offline_term(offline_term_id,data) {
    return api.post('api/tools_offline_curriculum/update_offline_term',{
        offline_term_id:offline_term_id,
        name:data.name,
        level:data.level,
        description:data.description,
        start_time:data.start_time,
        end_time:data.end_time,
        ex_time:data.ex_time,
        state:data.state?1:0});
}

export function select_add_term(select_term_id) {
    return api.post('api/tools_offline_curriculum/select_add_term',{
        select_term_id:select_term_id});
}


export function delete_offline_term(offline_term_id) {
    return api.post('api/tools_offline_curriculum/delete_offline_term',{
        offline_term_id:offline_term_id});
}

export function get_offline_curriculum_detail(offline_curriculum_id){
  return api.post('api/tools_offline_curriculum/get_offline_curriculum_detail', {
    offline_curriculum_id: offline_curriculum_id
  })
}

export function get_student_offline_curriculum_list(user_id,project_id){
  return api.post('api/tools_offline_curriculum/get_student_offline_curriculum_list', {
    project_id: project_id,
    user_id:user_id
  })
}

export function add_offline_term_count(user_id) {
    return api.post('api/tools_offline_curriculum/add_offline_term_count', {
    user_id:user_id
  })
}

export function sub_offline_term_count(user_id) {
    return api.post('api/tools_offline_curriculum/sub_offline_term_count', {
    user_id:user_id
  })
}
