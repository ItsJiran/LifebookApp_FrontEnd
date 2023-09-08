const HtmlWebpackPlugin = require('html-webpack-plugin');
const { dirname } = require('path');
const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

// specified environment
if(process.env.NODE_ENV == 'production') var env_path = path.resolve(__dirname, './.env.prod');
else                                     var env_path = path.resolve(__dirname, './.env.dev');
const dotenv = require('dotenv').config({path:env_path});

module.exports = {
  entry: './index.js',
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, `./dist/${process.env.NODE_ENV}/`),
    filename: 'index_bundle.js',
    publicPath: '/',
  },
  target: 'web',
  devServer: {
    port: '5000',
    static: { 
      directory: path.resolve(__dirname, 'public'), 
      publicPath: '/public'
    },
    open: false,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      'os':require.resolve("os-browserify/browser"),
      "crypto": false,
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/, 
        use: 'babel-loader', 
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader','postcss-loader'],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'public'),
        use: ['style-loader', 'css-loader','postcss-loader'],
      },
      {
        test: /\.svg$/i,
        include: path.resolve(__dirname, 'public'),
        use: ['svg-inline-loader','raw-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new NodePolyfillPlugin()
  ]
};
