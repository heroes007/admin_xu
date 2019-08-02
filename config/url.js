let env = process.env.NODE_ENV
const PRO_URL = 'http://api.9mededu.com/met/'
const TEST_URL = 'http://api.9mededu.com/met_test/'
const DEV_URL = 'http://192.168.6.63:5520/met_dev/'
// const DEV_URL = 'http://192.168.6.200:5520/met/'
// const DEV_URL = 'http://api.9mededu.com/met_test/'
// const DEV_URL = 'http://api.9mededu.com/met/'


export default env == 'production' ? PRO_URL : env == 'testing' ? TEST_URL : DEV_URL

