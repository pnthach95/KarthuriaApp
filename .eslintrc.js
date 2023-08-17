module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
      },
    },
  ],
  rules: {
    'no-console': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
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
    'react/no-unstable-nested-components': ['error', {allowAsProps: true}],
    'react/jsx-curly-brace-presence': [
      'warn',
      {props: 'never', children: 'never'},
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
    '@typescript-eslint/ban-ts-comment': 'off',
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
