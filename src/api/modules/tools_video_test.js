/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function add_video_test(curriculum_id,data) {
    return api.post('api/tools_video_test/add_video_test',{
        title:data.title,
        video_test_roles:data.video_test_roles,
        curriculum_id:curriculum_id,
        group_orderby:data.group_orderby,
        group_name:data.group_name,
        orderby:data.orderby
    });
}

export function get_detail(video_test_id) {
    return api.post('api/tools_video_test/get_detail',{
        video_test_id:video_test_id
    });
}

export function update_video_test(video_test_id,data) {
    return api.post('api/tools_video_test/update_video_test',{
        title:data.title,
        video_test_roles:data.video_test_roles,
        video_test_id:video_test_id
    });
}

export function add_test_detail(data) {
    return api.post('/product/curriculum_online_catalog/add_test',data);
}

export function update_test_detail(data) {
    return api.post('product/curriculum_online_catalog/change_video_test',{
      title: data.title,
      video_test_detail_id: data.video_test_detail_id,
      content: data.content,
      select_count: data.select_count,
      result: data.result,
      test_title: data.test_title,
      catalog_id:data.catalog_id,
      section_id:data.section_id
    });
}

export function get_test_detail_list(video_test_id) {
    return api.post('api/tools_video_test/get_test_detail_list',{
        video_test_id:video_test_id
    });
}

export function delete_test_detail(test_detail_id) {
    return api.post('/product/curriculum_online_catalog/delete',{
        test_detail_id:test_detail_id
    });
}
