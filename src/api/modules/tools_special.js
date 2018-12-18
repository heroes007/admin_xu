import api from './config'

export function get_production_group_list(param){
  return api.post('/api/tools_special/get_list',{
        page_index:param.page_index,
        page_size:param.page_size,
        name:param.name,
        state:[0,1]
        });
}

export function get_detail(special_id){
  return api.post('/api/tools_special/get_detail',{special_id:special_id});
}

export function add_special(param){
  return api.post('/api/tools_special/add_special',{
        name:param.name,
        short_description:param.short_description,
        description:param.description,
        img_url_arr:param.img_url_arr
        });
}

export function update_special(special_id,param){
  return api.post('/api/tools_special/update_special',{
        special_id:special_id,
        name:param.name,
        short_description:param.short_description,
        description:param.description,
        img_url_arr:param.img_url_arr
        });
}

export function switch_special(special_id,state){
  return api.post('/api/tools_special/switch_special',{special_id:special_id,state:state});
}

export function get_products(special_id){
  return api.post('/api/tools_special/get_products',{special_id:special_id});
}

export function add_products(special_id,product_ids){
  return api.post('/api/tools_special/add_products',{special_id:special_id,product_ids:product_ids});
}