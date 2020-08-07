const preview = {
  image: 'image',
  text: 'text',
  markdown: 'markdown'
}

const extensions = {
  gif: preview.image,
  jpeg: preview.image,
  jpg: preview.image,
  png: preview.image,

  md: preview.markdown,
  markdown: preview.markdown,
  mdown: preview.markdown,

  txt: preview.text
}

export { extensions, preview }
