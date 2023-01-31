module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: './src',
        alias: {
          api: './src/api/',
          'app-redux': './src/app-redux/',
          asset: './src/asset/',
          backend: './src/backend/',
          components: './src/components/',
          feature: './src/feature/',
          hook: './src/hook/',
          navigation: './src/navigation/',
          utility: './src/utility/',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
