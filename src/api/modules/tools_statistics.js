/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function getPVAndUV(param) {
    return api.post('api/tools_statistics/getPVAndUV',{
        start_time:param.start_time,
        end_time:param.end_time
    });
}

export function getPageFromPVAndUV(param) {
    return api.post('api/tools_statistics/getPageFromPVAndUV',{
        start_time:param.start_time,
        end_time:param.end_time
    });
}
