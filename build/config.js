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
        publicPath:'https://sfile.tl100.com/met_admin/dist/'
        // publicPath:'/'
    }
}
