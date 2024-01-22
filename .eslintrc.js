module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],

  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['!.commitlintrc.js'],
  rules: {
    'class-methods-use-this': 'off',
    'no-console': 'off',
    'max-classes-per-file': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': ['off', 'ForOfStatement']
  }
}
