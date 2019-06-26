import axios from 'axios'

export default axios.create({
    baseURL: 'http://api-class.e.vhall.com/api/class/',
    timeout: 10000,
    withCredentials: false,
    data: {
        key: 'fc7badd9d2bfc1964f500fb35d942f33',
        signed_at: new Date().getTime(),
        sign: '834b3955bb074b8215ddfb426858d1ab'
    }
})