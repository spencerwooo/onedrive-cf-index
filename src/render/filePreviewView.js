import marked from 'marked'

import { renderHTML } from './htmlWrapper'
import { renderPath } from './pathUtil'

import { preview, extensions } from './fileExtension'

async function renderMarkdownPreview(file) {
  const resp = await fetch(file['@microsoft.graph.downloadUrl'])
  const content = await resp.text()

  const renderedMd = marked(content)
  return `<div class="markdown-body" style="margin-top: 0;">
            ${renderedMd}
          </div>`
}

async function renderCodePreview(file, lang) {
  const resp = await fetch(file['@microsoft.graph.downloadUrl'])
  const content = await resp.text()
  const toMarkdown = `\`\`\`${lang}\n${content}\n\`\`\``
  const renderedCode = marked(toMarkdown)
  return `<div class="markdown-body" style="margin-top: 0;">
            ${renderedCode}
          </div>`
}

function renderPDFPreview(file) {
  return `<div id="pdf-preview-wrapper"></div>
          <div class="loading-label">
            <i class="fas fa-spinner fa-pulse"></i>
            <span>Loading PDF...</span>
          </div>
          <script src="https://cdn.jsdelivr.net/gh/pipwerks/PDFObject/pdfobject.min.js"></script>
          <script>
            fetch('${file['@microsoft.graph.downloadUrl']}').then(resp => {
              resp.blob().then(blob => {
                document.querySelector('.loading-label').classList.add('fade-out-bck')
                setTimeout(() => {
                  document.querySelector('.loading-label').remove()
                  document.querySelector('#pdf-preview-wrapper').classList.add('fade-in-fwd')
                  const pdfFile = new Blob([blob], { type: 'application/pdf' })
                  const pdfFileUrl = URL.createObjectURL(pdfFile)
                  PDFObject.embed(pdfFileUrl, '#pdf-preview-wrapper', {
                    height: '80vh',
                    fallbackLink: '<p>😟 This browser does not support previewing PDF, please download the PDF directly using the button below.</p>'
                  })
                }, 600)
              })
            })
          </script>`
}

function renderImage(file) {
  // See: https://github.com/verlok/vanilla-lazyload#occupy-space-and-avoid-content-reflow
  const ratio = (file.image.height / file.image.width) * 100
  return `<div class="image-wrapper" style="width: 100%; height: 0; padding-bottom: ${ratio}%; position: relative;">
            <img data-zoomable src="${file['@microsoft.graph.downloadUrl']}" alt="${file.name}" style="width: 100%; height: auto; position: absolute;"></img>
          </div>`
}

function renderUnsupportedView(fileExt) {
  return `<div class="markdown-body" style="margin-top: 0;">
            <p>Sorry, we don't support previewing <code>.${fileExt}</code> files as of today. You can download the file directly.</p>
          </div>`
}

async function renderPreview(file, fileExt) {
  switch (extensions[fileExt]) {
    case preview.markdown:
      return await renderMarkdownPreview(file)

    case preview.text:
      return await renderCodePreview(file, '')

    case preview.image:
      return renderImage(file)

    case preview.code:
      return await renderCodePreview(file, fileExt)

    case preview.pdf:
      return renderPDFPreview(file)

    default:
      return renderUnsupportedView(fileExt)
  }
}

export async function renderFilePreview(file, path, fileExt) {
  const nav = '<nav><div class="brand">📁 Spencer\'s OneDrive Index</div></nav>'
  const el = (tag, attrs, content) => `<${tag} ${attrs.join(' ')}>${content}</${tag}>`
  const div = (className, content) => el('div', [`class=${className}`], content)

  const body =
    nav +
    div(
      'container',
      div('path', renderPath(path) + ` / ${file.name}`) +
        div('items', el('div', ['style="padding: 1rem 1rem;"'], await renderPreview(file, fileExt))) +
        div(
          'download-button-container',
          el(
            'a',
            ['class="download-button"', `href="${file['@microsoft.graph.downloadUrl']}"`],
            '<i class="far fa-arrow-alt-circle-down"></i> DOWNLOAD'
          )
        )
    )
  return renderHTML(body)
}
