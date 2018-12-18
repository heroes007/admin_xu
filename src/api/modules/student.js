/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_student_list(page_index,page_size) {
    return api.post('api/user_student_mrzx/get_user_student_list',
        {page_index:page_index,
            page_size:page_size});
}

export function search_userinfo_by_nickname_or_phone(type,value) {
    return api.post('api/user_student_mrzx/search_userinfo_by_nickname_or_phone',{type:type,value:value});
}
export function set_user_student_mrzx(user) {
    return api.post('api/user_student_mrzx/set_user_student_mrzx',user);
}
