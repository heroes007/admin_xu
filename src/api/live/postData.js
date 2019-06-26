import api from './config'

export default (url, data) => {
    return api(url, data).then( res => {
        if(res.code == 200) {
            return res.data
        }
    })
}