/** @type {import('@react-native-community/cli-types/build/index').Config} */
module.exports = {
  project: {
    ios: {
      sourceDir: 'ios',
    },
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};
