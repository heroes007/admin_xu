import axios from 'axios';
//axios 用法：
//https://www.npmjs.com/package/axios
let api = axios.create({
  // baseURL: 'http://api2.laoshi123.com/',
  // baseURL: 'http://192.168.1.15:4005/',
  baseURL: 'http://api.tl100.com/met/',
  timeout: 10000,
  withCredentials: true,
  data: {  token: localStorage.getItem('token') || '' }
});

// const CancelToken = axios.CancelToken
// const pending = []
// const removePending = (config) => { // 取消请求操作
//   for (const [index, value] of pending.entries()) {
//     if (value.u === config.url + '&' + config.method + '&' + config.data) {
//       value.cancel('重复请求被取消')
//       pending.splice(index, 1)
//     }
//   }
// }
// api.interceptors.request.use(function (config) {
//   removePending(config); //在一个ajax发送前执行一下取消操作
//   config.cancelToken = new CancelToken(c => {
//     pending.push({
//       u: config.url + '&' + config.method + '&' + config.data,
//       cancel: c
//     })
//   })
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });
export default api;