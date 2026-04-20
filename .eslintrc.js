module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'prettier'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    'react-native/react-native': true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react-native/no-inline-styles': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off' // not needed in react 17+
  }
};
