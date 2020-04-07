module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',

    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  rules: {
    quotes: ['error', 'single'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-multi-spaces': ['error'],
    '@typescript-eslint/no-explicit-any': ['off'],
  },
};
