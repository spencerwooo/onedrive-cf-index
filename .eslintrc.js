module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    'space-before-function-paren': ['error', 'never']
  },
  globals: {
    TransformStream: true,
    REFRESH_TOKEN: true,
    CLIENT_SECRET: true,
    BUCKET: true,
    AUTH_PASSWORD: true
  }
}
