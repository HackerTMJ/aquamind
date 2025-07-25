/* eslint-env node */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-reanimated/plugin', // This must be last
    ],
  };
};
