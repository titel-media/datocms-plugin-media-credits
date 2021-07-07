module.exports = {
  extends: ['@titelmedia/eslint-config-es6', 'plugin:jest/recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier', 'jest', 'react-hooks'],
  parser: 'babel-eslint',
  env: {
    node: true,
    browser: true,
  },
  globals: {},
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.js*', '**/*.spec.js*'],
      rules: {
        'react/display-name': 'off',
        'no-console': 'off',
        'react/prop-types': 'off',
        camelcase: 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
