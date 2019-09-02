const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');

const getHtmlWebpackPlugin = () =>
  new HtmlWebpackPlugin({
    inject: 'body',
    template: helpers.resolvePath('src/client/index.html'),
  });

const getMiniCssExtractPlugin = folder =>
  new MiniCssExtractPlugin({
    filename: `${folder}/css/[name].[contenthash:8].css`,
    chunkFilename: `${folder}/css/[name].[contenthash:8].chunk.css`,
  });

const getPlugins = ({ folder } = {}) => {
  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';

  const getCommonPlugins = () => [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    getHtmlWebpackPlugin(),
  ];

  return isProduction
    ? [...getCommonPlugins(), getMiniCssExtractPlugin(folder)]
    : [...getCommonPlugins()];
};

module.exports = {
  getPlugins,
};
