import $LoadingY from '../plug/loading'
import {Config} from './base'
import axios from 'axios'
import Vue from 'vue'
import { Base64 } from 'js-base64';
import postData from '../api/postData'
var loadingInstance = null;
export default {
  IsLoading: (val) => {
    if (val) {
      loadingInstance = $LoadingY({message: "加载中，请稍后", show: true})
      setTimeout(() => {
        loadingInstance.close()
      }, Config.base_timeout);
    } else {
      if (loadingInstance) loadingInstance.close();
    }
  },
  /* 深拷贝 */
  copy: function (obj1, obj2) {
    var obj2 = obj2 || {};
    for (let name in obj1) {
      if (obj1[name] != null) {
        if (typeof obj1[name] === "object") {
          obj2[name] = obj1[name].constructor === Array ? [] : {};
          this.copy(obj1[name], obj2[name]);
        } else {
          obj2[name] = obj1[name];
        }
      } else {
        obj2[name] = null;
      }
    }
    return obj2; //然后在把复制好的对象给return出去
  },
  // 为小于10的数字添加0
  addZero(data) {
    if (typeof data === 'number') return data < 10 ? '0' + data : data + ''
  },
  getAuth(v){
    let d = Base64.decode(localStorage.getItem('PERMISSIONS'));
    let d1 = JSON.parse(d.slice(4))
    let da = null
    d1.map((t) => {
      let n = +t.permission_code.slice(0,2)
      if(n === v) da = t
    })
    if(da&&da.hasOwnProperty('child')) return da.child
    return false
  }
  // setAuth(){
  //   if(localStorage.getItem('PERMISSIONS')){
  //   let d = Base64.decode(localStorage.getItem('PERMISSIONS'));
  //   let d1 = JSON.parse(d.slice(4))
  //   d1.forEach(t => {
  //       let num = +t.permission_code.slice(0,2); 
  //       Vue.prototype['$PERMISSIONS' + num] = t
  //   });
  //   }
  // },
}
