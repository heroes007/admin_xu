/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(page_index, page_size){
    return api.post('api/tools_lb/get_list',{page_index:page_index,page_size:page_size});
}

export function get_detail(ad_id){
    return api.post('api/tools_lb/get_detail',{ad_id:ad_id});
}

export function update_lb(lbData){
    return api.post('api/tools_lb/update_lb',lbData);
}

export function add_lb(lbData){
    return api.post('api/tools_lb/add_lb',lbData);
}

export function delete_lb(lbData) {
  return api.post('api/tools_lb/remove_lb', lbData)
}

export function get_all_bl(){
    return api.post('/platform/banner/getBannerListAdmin',{
        position:1,
        page_size:2,
        page_num:1
    })
}
