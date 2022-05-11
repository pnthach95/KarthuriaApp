module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react',
    'react-hooks',
    'react-native',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-native/all',
  ],
  rules: {
    'react/prop-types': [
      'error',
      {
        ignore: ['navigation', 'modal'],
      },
    ],
    'no-console': 1,
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: './',
      },
    ],
    'object-shorthand': 1,
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-misused-promises': 0,
    'react-native/no-raw-text': 'off',
    'import/extensions': 0,
    'class-methods-use-this': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {
        alias: {
          map: [['~', './src/']],
          extensions: ['.ts', '.js', '.tsx'],
        },
      },
      typescript: {},
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    __DEV__: true,
  },
  ignorePatterns: ['/*.*'],
};
