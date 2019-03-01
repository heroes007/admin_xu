/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function logout(from) {
    return api.post('api/user/logout',{
        from: from
    });
}
export function login_pwd(name,password,debug) {
    return api.post('api/user/login', {
        username: name,
        pwd: password,
        is_debug:debug,
        from:'xg'
    });
}

export function user_info(){
    return api.post('api/user/user_info', {});
}
