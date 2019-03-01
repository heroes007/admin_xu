import axios from 'axios';
var api = axios.create({
    // baseURL: 'http://dealer.laoshi123.com/',
    baseURL: 'http://api.tl100.com/met/',
    // baseURL: 'http://192.168.1.15:4005/',
    timeout: 10000,
    withCredentials:true
  });
export function get_list() {
    return api.post('api/dealer/getSelectionListForDSCJ',{});
}