/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_curriculum_data_center(param, page, search) {
    let id = JSON.parse(localStorage.getItem('PRODUCTINFO')).id
    return api.post('/product/data/get_list',{
      product_id:id,
      page_size: page.page_size,
      page_num: page.page_num,
      search
    });
}

export function get_public_data_center(project_id) {
    return api.post('api/tools_data_center/get_public_data_center',{project_id:project_id});
}

export function add_data_center(param) {
  return api.post('product/data/add',{
        // name:param.name,
        // download_url:param.download_url,
        // type:param.type,
        // grade_id:param.grade_id,
        // subject_id:param.subject_id,
        // project_id:param.project_id

        title: param.name,
        curriculum_id: param.subject_id,
        attachment_url: param.download_url,
        attachment_name: param.url_name,
        type: param.type
        // state: 1
    });
}

export function set_data_center_pre_curriculums(data_center_id,curriculum_ids) {
    if(data_center_id&&curriculum_ids){
            return api.post('api/tools_data_center/set_data_center_pre_curriculums',{data_center_id:data_center_id,curriculum_ids:curriculum_ids});
    }
}

export function delete_data_center(data_center_id) {
    return api.post('product/data/delete',{data_id:data_center_id});
}

export function change_data_center_enable(data_center_id,state) {
    return api.post('api/tools_data_center/change_data_center_enable',{data_center_id:data_center_id,state:state});
}
