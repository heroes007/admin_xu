/**
 * Created by zhaiyunzhi on 2017/1/3.
 */
import api from './config'

export function login_pwd(name,password) {
    return api.post('/user/login', {
        username: name,
        password: password,
        from:'web'
    });
}

export function user_info(){
    return api.post('/user/getUsreDetail', {from:'web'});
}
