/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function add_video(data) {
    return api.post('product/curriculum_online_catalog/add_video',data
    // {
        // title:data.title,
        // duration:data.duration,
        // video_roles:data.video_roles,
        // dir:data.dir,
        // filename:data.filename,
        // video_url:data.video_url,
        // format:data.format,
        // curriculum_id:data.curriculum_id,
        // group_orderby:data.group_orderby,
        // group_name:data.group_name,
        // orderby:data.orderby

            // curriculum_id: data.curriculum_id,
            // video_url: data.video_url,
            // duration: parseInt(data.duration*60),
            // group_name: data.group_name,
    // }
    );
}

export function select_add_video(select_video_id,data) {
    return api.post('api/tools_video/select_add_video',{
        select_video_id:select_video_id,
        curriculum_id:data.curriculum_id,
        group_orderby:data.group_orderby,
        group_name:data.group_name,
        orderby:data.orderby
    });
}

export function get_detail(video_id) {
    return api.post('api/tools_video/get_detail',{
        video_id:video_id
    });
}

export function update_video(d) {
    return api.post('/product/curriculum_online_catalog/change',d);
}

export function select_update_video(select_video_id,video_id,catalog_id) {
    return api.post('api/tools_video/select_add_video',{
        select_video_id:select_video_id,
        video_id:video_id,
        catalog_id:catalog_id
    });
}

export function delete_video(video_id) {
    return api.post('api/tools_video/delete_video',{
        video_id:video_id
    });
}

export function get_video_source(video_id,format) {
    return api.post('api/video/get_video_source',{
        video_id:video_id,
        format:format
    });
}