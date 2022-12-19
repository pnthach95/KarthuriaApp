module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '*': '.',
        },
      },
    ],
    'nativewind/babel',
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
