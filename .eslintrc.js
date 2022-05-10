module.exports = {
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['prettier', 'airbnb-base'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': 'off',
    'global-require': 'off',
    'class-methods-use-this': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-rules': 'off',
    'no-restricted-syntax': 'off',
    'import/no-dynamic-require': 'off',
    'consistent-return': 'off',
    'no-useless-return': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
  },
};
