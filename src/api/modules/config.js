import axios from 'axios';
//axios 用法：
//https://www.npmjs.com/package/axios
export default axios.create({
  // baseURL: 'http://api2.laoshi123.com/',
  // baseURL: 'http://192.168.6.114:4105/met/',
  // baseURL: 'https://api.tl100.com/met/api/',
  baseURL: 'http://192.168.6.55:5020/met/api/' ,
  timeout: 10000,
  withCredentials: false,
  data: {  token: localStorage.getItem('token') || '' }
});
