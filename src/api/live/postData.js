import api from './config'
import Message from 'iview'

export default (url, data) => {
    return api(url, data).then( res => {
        if(res.code == 200) {
            return res.data
        }
    })
}