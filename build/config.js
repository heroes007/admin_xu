var path = require('path')

module.exports = {
    base:{
        path: path.resolve(__dirname,'../server/dist'),
        assetsPath:'static'
    },
    dev:{
        publicPath:'/',
        port: 8001
    },
    prod:{
        publicPath:'http://sfile.jiuhuatech.com/met_admin/dist/',
        port: 8021,
    },
    test: {
        publicPath:'/',
        port: 8521
    }
}
