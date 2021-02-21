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
    CLIENT_SECRET: true,
    BUCKET: true,
    BASE: true,
    CLIENT_ID: true,
    PROXYDOWNLOAD: true,
    REDIRECT_URL: true,
    UPLOAD: true,
    UPLOAD_SECRET_KEY: true
  }
}
