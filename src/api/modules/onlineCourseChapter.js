import api from './config'

export default (data) => {
    return api.post('api/tools_video/update_video_group_name',{...data});
}
