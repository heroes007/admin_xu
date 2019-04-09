import axios from 'axios';
export default axios.create({
  // baseURL: 'http://api2.laoshi123.com/',
  // baseURL: 'http://192.168.6.114:4105/met/',
  // baseURL: 'http://api.jiuhuatech.com/met/',
  baseURL: 'http://192.168.6.55:5021/met/' ,
  // baseURL: 'http://192.168.6.141:5020/met',
  timeout: 10000,
  withCredentials: false,
  data: {  token: localStorage.getItem('token') || '' }
});
