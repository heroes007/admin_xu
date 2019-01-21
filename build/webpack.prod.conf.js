var webpack = require('webpack')
var config = require('./config')
var path = require('path')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const devMode = process.env.NODE_ENV !== 'production'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /(node_modules|bower_components)/,
  },{
      test: /\.vue$/,
      use: [{
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [MiniCssExtractPlugin.loader,"css-loader"],
            scss: [MiniCssExtractPlugin.loader,"sass-loader"]
          }
        }
      },
      {
          loader: 'iview-loader',
          options: {
              prefix: false
          }
      }]
    },{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader,"css-loader", "style-loader"]
    }, {
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader,"css-loader", "style-loader", "sass-loader"]
    },],
    noParse: /videojs-contrib-hls/
  },
  resolve: {
    //切换min，去掉警告
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  },
  output: {
    // publicPath: 'https://file.laoshi123.com',
    publicPath: config.prod.publicPath,
    filename: config.base.assetsPath + '/js/[name].[chunkhash].js',
    chunkFilename: config.base.assetsPath + '/js/[name].[chunkhash].js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin({
        // assetNameRegExp: [/\.optimize\.css$/g,/\.optimize\.scss$/g],
        // cssProcessor: require('cssnano'),
        // cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
        // canPrint: true
      })
    ],
    splitChunks: {
      // 可自己配置，建议第一次升级先不配置
    }
  },
  //devtool: "#source-map",
  plugins: [
    new VueLoaderPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production')
    // }),
    // new webpack.optimize.UglifyJsPlugin(),
    // extract css into its own file
    // new ExtractTextPlugin(config.base.assetsPath + '/css/[name].[contenthash].css'),
    new MiniCssExtractPlugin({
      filename: config.base.assetsPath +'css/[name].[contenthash:12].css',
      allChunks: true,
    }),
    // new UglifyJsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      //      filename: pathResolve('../server/dist/index.html'),
      template: 'index.html',
      inject: true
      /*minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'*/
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index_1.html',
    //   template: 'index.html',
    //   inject: true,
    // }),
    // split vendor js into its own file
    /*new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor','manifest']
      //minChunks: Infinity

    }),*/
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     return module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
    //   }
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    /*new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })*/
  ]
})

module.exports = webpackConfig
