let env = process.env.NODE_ENV
const PRO_URL = 'http://api.9mededu.com/met/'
const TEST_URL = 'http://api.met.xuege100.com/met/'
// const DEV_URL = 'http://192.168.6.55:5520/met/'
const DEV_URL = 'http://192.168.6.62:5520/met/'

export default env == 'production' ? PRO_URL : env == 'testing' ? TEST_URL : DEV_URL

