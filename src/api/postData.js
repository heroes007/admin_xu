import api from './modules/config'
import { Message } from 'iview';

export  default (url,data) => {
  return api.post(url, data).then((res) => {
    if(res.data.res_code === 1){
      return res.data
    }else{
      Message.warning(res.data.msg);
      // return false
    }
  })
}

