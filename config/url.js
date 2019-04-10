let env = process.env.NODE_ENV 
let PRO_URL = 'http://api.jiuhuatech.com/met/'
let TEST_URL = 'http://api.met.xuege100.com/met/'
let DEV_URL = 'http://192.168.6.55:5520/met/'
export default env == 'production' ? PRO_URL : env == 'testing' ? TEST_URL : DEV_URL