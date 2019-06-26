import api from './config'

export default (url, data) => {
    return api.get(url, data).then( res => {
        if(res.code == 200) {
            return res.data
        }
    })
}