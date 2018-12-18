/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_all_students(no_group, project_id, page_index, page_size, grade_id, subject_id, phone, username, realname, is_test_user, state, userid, product_id) {
    return api.post('api/tools_student/get_all_students', {
        no_group: no_group,
        project_id: project_id,
        page_index: page_index,
        grade_ids: grade_id,
        subject_ids: subject_id,
        page_size: page_size,
        phone: phone,
        username: username,
        realname:realname,
        is_test_user:is_test_user,
        states:state,
        user_id:userid,
        product_id:product_id
    });
}

export function create_student(params) {
    return api.post('api/tools_student/create_student', {
        user_id: params.user_id,
        project_id: params.project_id,
        grade_id: params.grade_id,
        subject_id: params.subject_id,
        realname:params.realname,
        is_send_offline_term: params.is_send_offline_term,
        offline_term_id: params.offline_term_id,
        is_test_user:params.is_test_user,
        product_id:params.product_id
    });
}

export function delete_student(student_id) {
    return api.post('api/tools_student/delete_student', {
        student_id: student_id 
    });
}

export function edit_student(student_id, params) {
    return api.post('api/tools_student/edit_student', {
        student_id: student_id,
        user_id: params.user_id,
        project_id: params.project_id,
        grade_id: params.grade_id,
        subject_id: params.subject_id,
        start_school_time: params.start_school_time,
        finish_school_time: params.finish_school_time,
        leave_school_time: params.leave_school_time,
        type: params.type,
        tutor_user_id: params.tutor_user_id,
        xg_user_id: params.xg_user_id,
        state: params.state,
        realname:params.realname,
        is_test_user:params.is_test_user
    });
}

export function get_student_detail(student_id) {
    return api.post('api/tools_student/get_student_detail', {
        student_id: student_id
    });
}

export function send_student_online_curriculum(params) {
    return api.post('api/tools_student/send_student_online_curriculum', {
        project_id: params.project_id,
        user_id: params.user_id
    })
}

export function get_student_online_curriculum(params) {
    return api.post('/api/tools_student/get_student_online_curriculum', {
        project_id: params.project_id,
        user_id: params.user_id
    })
}
export function get_students_by_offline_term(params) {
    return api.post('/api/tools_student/get_students_by_offline_term', {
        offline_term_id: params.offline_term_id,
        page_index: params.page_index,
        page_size: params.page_size,
        subject_id: params.subject_id,
        grade_id: params.subject_id,
        phone: params.phone,
        username: params.username
    })
}
export function send_student_offline_curriculum(params){
  return api.post('/api/tools_student/send_student_offline_curriculum', {
    offline_term_id: params.offline_term_id,
    user_id: params.user_id
  })
}

export function clear_online_curriculum_record(project_id,to_user_id){
  return api.post('/api/tools_student/clear_online_curriculum_record', {
    project_id: project_id,
    to_user_id: to_user_id
  })
}

export function new_version_clear_online_curriculum_record(product_id,to_user_id){
  return api.post('/api/tools_student/new_version_clear_online_curriculum_record', {
    product_id: product_id,
    to_user_id: to_user_id
  })
}

export function new_version_create_student(params) {
    return api.post('api/tools_student/new_version_create_student', {
        user_id: params.user_id,
        project_id: params.project_id,
        grade_id: params.grade_id,
        subject_id: params.subject_id,
        realname:params.realname,
        is_send_offline_term: params.is_send_offline_term,
        offline_term_id: params.offline_term_id,
        is_test_user:params.is_test_user,
        product_id:params.product_id
    });
}

export function new_version_get_student_online_curriculum(params) {
    return api.post('/api/tools_student/new_version_get_student_online_curriculum', {
        project_id: params.project_id,
        product_id:params.product_id,
        user_id: params.user_id
    })
}