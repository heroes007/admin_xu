/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(page, keyword) {
    // let id = project_id ? project_id:  +localStorage.getItem('organizationId')
    let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
    return api.post('product/curriculum_online/get_list',{
        product_id: id,
        // title:title
        // product_id: 11,
        page_size: page.page_size,
        page_num: page.page_num,
        keyword: keyword
    });
}

export function add_curriculum(data) {
    let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
    return api.post('product/curriculum_online/add', {
      product_id: id,
      title: data.title,
      teacher_id: data.teacher_id,
      department_id: data.department_id,
      grade_id: data.grade_id,
      state: data.state,
      description: data.description,
      img_url: data.img_default,
      unlock_type: data.unlock_type
    })
}

export function update_curriculum(data) {
    return api.post('product/curriculum_online/change',{
        curriculum_online_id:data.id,
        title:data.title,
        teacher_id: data.teacher_id,
        department_id: data.department_id,
        grade_id: data.grade_id,
        state: data.state,
        description: data.description,
        img_url: data.img_url,
        unlock_type: data.unlock_type,
    });
}


export function delete_curriculum(id,project_id) {
    return api.post('product/curriculum_online/delete',{
      curriculum_online_id:id});
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

export function change_curriculum_list(id, direction) {
    return api.post('product/curriculum_online_catalog/move', {catalog_id: id, direction})
}
