// [eslint rule docs](http://eslint.org/docs/rules/)

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  rules: {
    semi: ['error', 'never'],
    'no-console': 'off',
    'global-require': 'off',
    'space-before-function-paren': ['error', 'always'],
    'func-names': 'error',
    'prefer-arrow-callback': 'error' ,
  },
}
