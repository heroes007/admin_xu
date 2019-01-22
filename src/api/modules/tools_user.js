/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(page_index, page_size, role_id){
  return api.post('api/tools_user/get_list',{page_index:page_index,page_size:page_size,role_id:role_id});
}

export function get_detail(user_id){
  return api.post('api/tools_user/get_detail',{user_id:user_id});
}

export function search_user(type,param,page_index, page_size, role_id){
  return api.post('api/tools_user/search_user',{type:type,param:param,page_index:page_index,page_size:page_size,role_id:role_id});
}

export function get_teachers(){
  return api.post('api/tools_user/get_teachers', {})
}

export function get_student_managers(){
  return api.post('api/tools_user/get_student_managers', {})
}

export function create_test_user(need_regist){
  return api.post('api/tools_user/create_test_user', {need_regist:need_regist});
}

export function changeDealer(params){
  return api.post('api/tools_user/changeDealerId',params);
}
