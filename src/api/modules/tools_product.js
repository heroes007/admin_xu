import api from './config'

export function get_list(param) {
  return api.post('/api/tools_product/get_list', {
    project_id: param.project_id,
    page_index: param.page_index,
    page_size: param.page_size,
    title: param.title,
    state: [0, 1, 2, 3],
    type: param.type
  });
}

export function get_detail(product_id) {
  return api.post('/api/tools_product/get_detail', {product_id: product_id});
}

export function get_certificate() {
  return api.post('api/honour/get_honour_certificates')
}

export function change_certificate(param, product_id) {
  return api.post('api/honour/set_honour_to_product', {
    honour_ids: JSON.stringify(param),
    product_id: product_id,
  })
}

export function get_product_certificate(param, user_id) {
  let obj = {product_id: param.product_id}
  let obj2 = user_id ?  {user_id, ...obj} : obj
  return api.post('api/honour/get_product_honours', obj2)
}

export function get_certificate_list() {
  return api.post('api/honour/get_honour_certificates')
}

export function add_certificate(param) {
  return api.post('api/honour/add_new_honour_certificate', {
    name: param.name,
    detail: param.detail,
    img_url: param.img_url
  })
}

export function edit_certificate(param) {
  return api.post('api/honour/modify_honour_certificate', {
    id: param.id,
    name: param.name,
    detail: param.detail,
    img_url: param.img_url
  })
}

export function delete_certificate(certificate_id) {
  return api.post('api/honour/remove_honour_certificate',{
    id:certificate_id
  })
}

export function get_certificate_detail(certificate_id){
  return api.post('api/honour/get_honour_certificates',{
    id: certificate_id
  })
}

export function get_certificate_user_post(product_id, honour_id, user_id) {
  return api.post('api/honour/issue_honour_to_user',{product_id, honour_id, user_id})
}

export function get_certificate_user(user_id) {
  return api.post('api/honour/get_user_honours',{user_id})
}

export function add_product(param) {
  let d = {
    organization_id: param.organization_id,
    title:param.title,
    original_price: +param.original_price,
    price: +param.price,
    unlock_type: param.unlock_type,
    state: param.state,
    short_description: param.short_description,
    description: param.description,
    url_arr: param.url_arr,
    duration: 0
  }
  // if(param.unlock_type === 0) delete d.unlock_type
  return api.post('product/product/add', d);
}

export function update_product(param) {
  let d = {
    organization_id: param.organization_id,
    product_id: param.product_id,
    title:param.title,
    original_price: +param.original_price,
    price: +param.price,
    unlock_type: param.unlock_type,
    state: param.state,
    short_description: param.short_description,
    description: param.description,
    url_arr: param.url_arr,
    duration: 0
  }
  // if(param.unlock_type === 0) delete d.unlock_type
  return api.post('/product/product/change', d);
}

export function switch_product(product_id, state) {
  return api.post('/api/tools_product/switch_product', {product_id: product_id, state: state});
}

export function get_curriculums(product_id) {
  return api.post('/api/tools_product/get_curriculums', {product_id: product_id});
}

export function add_curriculums(product_id, curriculum_ids) {
  return api.post('/api/tools_product/add_curriculums', {product_id: product_id, curriculum_ids: curriculum_ids});
}

export function set_pre_curriculums(product_id, curriculum_id, pre_curriculum_ids) {
  return api.post('/api/tools_product/set_pre_curriculums', {
    product_id: product_id,
    curriculum_id: curriculum_id,
    pre_curriculum_ids: pre_curriculum_ids
  });
}

export function delete_curriculum(product_id, curriculum_id) {
  return api.post('/api/tools_product/delete_curriculum', {product_id: product_id, curriculum_id: curriculum_id});
}
