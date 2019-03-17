/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_signup_list(page_index,page_size,param) {
    return api.post('api/w/get_signup_list',{page_index:page_index,page_size:page_size,interview_state:param.interview_state,interview_result:param.interview_result,subject_id:param.subject_id,written_hg:param.written_hg,realname:param.realname,phone:param.phone});
}
export function get_signup_info(signup_id) {
    return api.post('api/w/get_signup_info', {
        signup_id:signup_id
    });
}
export function update_interview(signup_id,param) {
    return api.post('api/w/update_interview', {
        signup_id:signup_id,
        interview_state:param.interview_state,
        interview_result:param.interview_result,
        interview_time:param.interview_time,
        interview_comment:param.interview_comment
    });
}

export function send_interview_msg(signup_id, interview_time) {
    return api.post('api/w/send_interview_msg', {
        signup_id:signup_id,
        interview_time:interview_time
    });
}

export function set_interview_tutor(data) {
    return api.post('api/w/set_interview_tutor', {
        interview_plan:data
    });
}

export function get_interview_tutor() {
    return api.post('api/w/get_interview_tutor', {
    });
}

export function get_signup_info_by_userid(user_id){
    return api.post('api/w/get_signup_info_by_userid', {
        user_id:user_id
    });
}

export function update_signup_info(signup_id,params){
    return api.post('api/w/update_signup_info', {
        signup_id:signup_id,
        realname:params.realname,
        phone:params.phone,
        grade_id:params.grade_id,
        subject_id:params.subject_id,
        written_result:params.written_result,
        birth:params.birth,
        email:params.email,
        school:params.school,
        school_subject:params.school_subject,
        school_grade:params.school_grade,
        ex_citys:params.ex_citys
    });
}

export function drop_student_signup(signup_id){
    return api.post('api/w/drop_student_signup', {
        signup_id:signup_id
    });
}

export function get_houner_list(){
    let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
    return api.post('product/get_product_honours',{
        product_id:id
    })
}