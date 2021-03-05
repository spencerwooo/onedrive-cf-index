const preview = {
  markdown: 'markdown',
  image: 'image',
  text: 'text',
  pdf: 'pdf',
  code: 'code',
  video: 'video',
  audio: 'audio'
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
  m3u8: preview.video,

  mp3: preview.audio,
  m4a: preview.audio,
  mkv: preview.video,
  aac: preview.audio,
  wav: preview.audio,
  ogg: preview.audio,
  oga: preview.audio,
  opus: preview.audio,
  flac: preview.audio
}

export { extensions, preview }
