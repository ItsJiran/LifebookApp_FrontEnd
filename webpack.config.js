const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
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
  ]
};
