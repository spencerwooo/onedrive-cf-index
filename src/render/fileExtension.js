const preview = {
  image: 'image',
  text: 'text',
  pdf: 'pdf',
  code: 'code',
  markdown: 'markdown',
  video: 'video'
}

const extensions = {
  gif: preview.image,
  jpeg: preview.image,
  jpg: preview.image,
  png: preview.image,

  md: preview.markdown,
  markdown: preview.markdown,
  mdown: preview.markdown,

  pdf: preview.pdf,

  c: preview.code,
  cpp: preview.code,
  js: preview.code,
  java: preview.code,
  sh: preview.code,
  cs: preview.code,
  py: preview.code,
  css: preview.code,
  html: preview.code,
  ts: preview.code,
  vue: preview.code,
  json: preview.code,
  yaml: preview.code,
  toml: preview.code,

  txt: preview.text,

  mp4: preview.video,
  flv: preview.video,
  webm: preview.video,
  m3u8: preview.video
}

export { extensions, preview }
