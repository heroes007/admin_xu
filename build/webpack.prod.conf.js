var webpack = require('webpack')
var config = require('./config')
var path = require('path')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
// function pathResolve(relPath) {
//   return path.resolve(__dirname, relPath);
// }
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css']
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [["@babel/preset-env",{"targets": { "esmodules": true,"node": true }}]],
            },
          }
        ],
        // include: [pathResolve('node_modules/vue-ueditor')],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              scss: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
          }
        },
          {
            loader: 'iview-loader',
            options: {
              prefix: false
            }
          }]
      },
      {
        test: /\.(sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }],
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
    filename: config.base.assetsPath + '/js/[name].[hash].js',
    chunkFilename: config.base.assetsPath + '/js/[name].[chunkhash].js'
  },
  performance: {
    hints: false
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        include: /\/includes/,
        exclude: /\/excludes/,
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
          mangle: true, // Note `mangle.properties` is `false` by default.
          toplevel: false,
          ie8: false,
          keep_fnames: false
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.(sc|c)ss$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true }, autoprefixer: false},
        canPrint: true
      })
    ],
    splitChunks:{
      chunks: 'async',
      minChunks: 1,
      name: false,
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  //devtool: "#source-map",
  plugins: [
    new CleanWebpackPlugin([config.base.path]),
    new VueLoaderPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: config.base.assetsPath + '/css/[name].[hash].css',
      chunkFilename: config.base.assetsPath + '/css/[name].[chunkhash].css'
    }),
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
    // new CompressionWebpackPlugin({
    //   test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
    //   threshold: 8192,
    //   minRatio: 0.8
    // }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
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
