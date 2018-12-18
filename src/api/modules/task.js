/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_task_list(page_index,page_size,is_auto) {
    return api.post('api/task/get_task_list',
        {page_index:page_index,
            page_size:page_size,
            is_auto:is_auto});
}
export function update_task(data) {
    return api.post('api/task/update_task',data);
}
export function add_task(data) {
    return api.post('api/task/add_task',data);
}
export function get_task_by_id(task_id) {
    return api.post('api/task/get_task_by_id',{task_id:task_id});
}
export function get_task_category_list() {
    return api.post('api/task_category/get_task_category_list',{});
}
export function get_no_read_over_list(task_category_id,page_index,page_size,order_by_col,order_by_desc,subject_id) {
    return api.post('api/user_task/get_no_read_over_list',{task_category_id:task_category_id,
        page_index:page_index,
        page_size:page_size,
        order_by_col:order_by_col,
        order_by_desc:order_by_desc,
        subject_id:subject_id});
}
export function get_read_over_list(task_category_id,page_index,page_size,order_by_col,order_by_desc,subject_id) {
    return api.post('api/user_task/get_read_over_list',{task_category_id:task_category_id,
        page_index:page_index,
        page_size:page_size,
        order_by_col:order_by_col,
        order_by_desc:order_by_desc,
        subject_id:subject_id});
}
export function get_no_upload_list(task_category_id,page_index,page_size,order_by_col,order_by_desc,subject_id) {
    return api.post('api/user_task/get_read_over_list',{task_category_id:task_category_id,
        page_index:page_index,
        page_size:page_size,
        order_by_col:order_by_col,
        order_by_desc:order_by_desc,
        subject_id:subject_id});
}