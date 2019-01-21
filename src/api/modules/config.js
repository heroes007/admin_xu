import axios from 'axios';
//axios 用法：
//https://www.npmjs.com/package/axios
var api = axios.create({
  baseURL: 'http://api2.laoshi123.com/',
  // baseURL: 'http://192.168.1.15:4005/',
  // baseURL: 'http://api.tl100.com/met/',
  timeout: 10000,
  withCredentials: true,
  data: {  token: localStorage.getItem('token') || '' }
});

export default api;
