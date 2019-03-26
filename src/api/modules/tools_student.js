/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_students_by_offline_term(params) {
  return api.post('/product/curriculum_offline/subject_join_student_get_list', params)
}
export function send_student_offline_curriculum(params){
return api.post('/product/curriculum_offline/term_send', params)
}
