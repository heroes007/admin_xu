/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_list(cate_id,sub_cate_id,video_tags_id,page_index,page_size) {
    return api.post('api/curriculum/get_list',{cate_id: cate_id,
        sub_cate_id: sub_cate_id,
        video_tags_id: video_tags_id,
        page_index: page_index,
        page_size: page_size});
}