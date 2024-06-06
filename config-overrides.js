/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const {
  override,
  overrideDevServer,
  addWebpackModuleRule,
  addWebpackPlugin,
  addWebpackAlias,
} = require('customize-cra');
const ArcoWebpackPlugin = require('@arco-plugins/webpack-react');
const addLessLoader = require('customize-cra-less-loader');
const setting = require('./src/settings.json');

module.exports = {
  webpack: override(
    (config) => {
      const htmlPluginIndex = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin'
      );
      if (htmlPluginIndex >= 0) {
        config.plugins[htmlPluginIndex].options.favicon =
          './src/assets/logo.svg';
      }
      return config;
    },
    addLessLoader({
      lessLoaderOptions: {
        lessOptions: {},
      },
    }),
    addWebpackModuleRule({
      test: /\.svg$/,
      loader: '@svgr/webpack',
    }),
    addWebpackPlugin(
      new ArcoWebpackPlugin({
        theme: '@arco-themes/react-arco-pro',
        modifyVars: {
          'arcoblue-6': setting.themeColor,
        },
      })
    ),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
    })
  ),
  devServer: overrideDevServer((config, env) => {
    if (env === 'development') {
      config.devServer.hot = false;
    }
    return {
      ...config,
      proxy: [
        {
          context: (pathname, req) => {
            return pathname.includes('/ibf/api/hr');
          },
          target: 'http://82.157.105.217:8080/',
          changeOrigin: true,
        },
      ],
    };
  }),
};
