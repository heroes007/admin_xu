import api from './config'

export function get_list(param){
  return api.post('/api/tools_product/get_list',{
        project_id:param.project_id,
        page_index:param.page_index,
        page_size:param.page_size,
        title:param.title,
        state:[0,1,2,3],
        type:param.type
        });
}

export function get_detail(product_id){
  return api.post('/api/tools_product/get_detail',{product_id:product_id});
}

export function add_product(param){
  return api.post('/api/tools_product/add_product',{
        project_id:param.project_id,
        code:param.code,
        title:param.title,
        price:param.price,
        original_price:param.original_price,
        short_description:param.short_description,
        description:param.description,
        img_url_arr:param.img_url_arr,
        h5_url:param.h5_url,
        curriculum_id:param.curriculum_id,
        examine_type:param.examine_type
        });
}

export function update_product(product_id,param){
  return api.post('/api/tools_product/update_product',{
        product_id:product_id,
        title:param.title,
        code:param.code,
        price:param.price,
        original_price:param.original_price,
        short_description:param.short_description,
        description:param.description,
        img_url_arr:param.img_url_arr,
        h5_url:param.h5_url,
        curriculum_id:param.curriculum_id,
        examine_type:param.examine_type
        });
}

export function switch_product(product_id,state){
  return api.post('/api/tools_product/switch_product',{product_id:product_id,state:state});
}

export function get_curriculums(product_id){
  return api.post('/api/tools_product/get_curriculums',{product_id:product_id});
}

export function add_curriculums(product_id,curriculum_ids){
  return api.post('/api/tools_product/add_curriculums',{product_id:product_id,curriculum_ids:curriculum_ids});
}

export function set_pre_curriculums(product_id,curriculum_id,pre_curriculum_ids){
  return api.post('/api/tools_product/set_pre_curriculums',{product_id:product_id,curriculum_id:curriculum_id,pre_curriculum_ids:pre_curriculum_ids});
}

export function delete_curriculum(product_id,curriculum_id){
  return api.post('/api/tools_product/delete_curriculum',{product_id:product_id,curriculum_id:curriculum_id});
}
