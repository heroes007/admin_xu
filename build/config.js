var path = require('path')

module.exports = {
    base:{
        path: path.resolve(__dirname,'../server/dist'),
        assetsPath:'static'
    },
    dev:{
        publicPath:'/',
        port: 8001,
        // proxyTable: {
        //     '/api': {
        //         target: 'http://api-class.e.vhall.com',
        //         changeOrange: true
        //     }
        // }
    },
    prod:{
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/met_admin/dist/'
    },
    test: {
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/met_admin_test/dist/',
    }
}
