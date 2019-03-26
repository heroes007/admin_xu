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

export function add_data_center(param) {
  return api.post('product/data/add',{
        title: param.name,
        curriculum_id: param.subject_id,
        attachment_url: param.download_url,
        attachment_name: param.url_name,
        type: param.type
    });
}

export function delete_data_center(data_center_id) {
    return api.post('product/data/delete',{data_id:data_center_id});
}
