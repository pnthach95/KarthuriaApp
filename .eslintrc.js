module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: {
              arguments: false,
              attributes: false,
            },
          },
        ],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'no-console': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'prefer-const': 'error',
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
    'react-native/sort-styles': [
      'error',
      'asc',
      {ignoreClassNames: false, ignoreStyleProperties: false},
    ],
    'react-native/no-raw-text': 'error',
    'react-native/no-single-element-style-arrays': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-unused-styles': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    'object-shorthand': ['error', 'always'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    eqeqeq: ['error', 'always'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'internal',
          'external',
          'parent',
          'sibling',
          'index',
          'type',
        ],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'sort-imports': ['error', {ignoreDeclarationSort: true}],
  },
};
