/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

// export function get_category_list(project_id) {
//     return api.post('api/tools_task/get_category_list',{project_id:project_id});
// }

export function get_category_list() {
    let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
    return api.post('/product/homework/get_list',{product_id:id,page_size:10,page_num:1});
}

export function create_category(params) {
    return api.post('/product/homework/add',{
        title:params.realname,
        type:params.jurisdiction,
        curriculum_id:params.binding_course,
        description:params.uploading,
        attachment_url:params.attachment_url?params.attachment_url:"www.laoshi123.com"
    });
}

export function get_category_by_id(category_id) {
    return api.post('api/tools_task/get_category_by_id',{cid:category_id});
}

export function edit_category_by_id(homworkId,params) {
    return api.post('/product/homework/change',{
        homework_id:homworkId,
        title:params.realname,
        type:params.jurisdiction,
        curriculum_id:params.binding_course,
        description:params.uploading,
        attachment_url:params.attachment_url?params.attachment_url:"www.laoshi123.com"
    });
}

export function delete_category_by_id(category_id) {
    return api.post('api/tools_task/delete_category_by_id',{cid:category_id});
}

export function get_tasklist_by_cid(category_id) {
    return api.post('api/tools_task/get_tasklist_by_cid',{cid:12});
}

export function create_task(category_id,params) {
    return api.post('api/tools_task/create_task',{cid:category_id,
        name:params.name,
        duration:params.duration,
        grade_id:params.grade_id,
        subject_id:params.subject_id,
        type:params.type,
        result_type:params.result_type,
        activity_type:params.activity_type,
        activity_param:params.activity_param,
        task_require:params.task_require,
        upload_files:params.upload_files,
        max_file_count:params.max_file_count
    });
}

export function get_curriculumlist(params) {
    return api.post('api/tools_task/get_curriculumlist',{
        project_id:params.project_id,
        grade_id:params.grade_id,
        subject_id:params.subject_id
    });
}

export function get_task_by_id(task_id) {
    return api.post('api/tools_task/get_task_by_id',{task_id:task_id});
}

export function edit_task(task_id,params) {
    return api.post('api/tools_task/edit_task',{task_id:task_id,
        name:params.name,
        duration:params.duration,
        result_type:params.result_type,
        task_require:params.task_require,
        upload_files:params.upload_files
    });
}

export function delete_task_by_id(homework_id) {
    return api.post('/product/homework/delete',{homework_id});
}

export function get_userlist_by_tid(task_id,project_id,grade_id,subject_id,page_size,page_index,phone,username,realname,userid) {
    return api.post('api/tools_task/get_userlist_by_tid',{task_id:task_id,
        project_id:project_id,
        grade_id:grade_id,
        subject_id:subject_id,
        page_size:page_size,
        page_index:page_index,
        phone:phone,
        username:username,
        realname:realname,
        user_id:userid
    });
}

export function send_task(task_id,project_id,user_list) {
    return api.post('api/tools_task/send_task',{task_id:task_id,project_id: project_id,user_list:user_list});
}

export function get_tutor_task_list(params) {
    return api.post('api/tools_task/get_tutor_task_list',params);
}

export function get_readover_detail(user_task_id) {
    return api.post('api/tools_task/get_readover_detail',{user_task_id:user_task_id});
}

export function readover(user_task_id,read_over_content,state) {
    return api.post('api/tools_task/readover',{user_task_id:user_task_id,read_over_content:read_over_content,state:state});
}

export function get_student_task_list(project_id,user_id) {
    return api.post('api/tools_task/get_student_task_list',{project_id:project_id,user_id:user_id});
}

export function get_student_work_list(project_id,user_id) {
    return api.post('api/tools_task/get_student_work_list',{project_id:project_id,user_id:user_id});
}

export function get_curriculumlist_online(params) {
    let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
    return api.post('/product/curriculum_online/get_list',{
        product_id:id,
        page_size:998,
        page_num:1,
    });
}

export function get_read_over(params) {
    let id = JSON.parse(localStorage.getItem('MarkingHomework')).id
    return api.post('/product/homework/student_homework_get_list',{
        homework_id: id,
        search: "",
        page_size: 3,
        page_num: 1,
    });
}

export function save_datalist(params) {
    return api.post('/product/data/add',{
        title: params.name,
        curriculum_id: params.subject_id,
        attachment_url: params.download_url,
        state: 1
    })
}