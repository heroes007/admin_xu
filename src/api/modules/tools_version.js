/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function get_all_version(){
    return api.post('api/sys/get_all_version',{});
}

export function edit_version(payload){
    return api.post('api/sys/edit_version', {
        id:payload.id,
      	ver:payload.ver,
      	type:payload.type,
      	platform_type:payload.platform_type,
      	info:payload.info,
      	download_url:payload.download_url,
      	state:payload.state
    })
}