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
            <span id="loading-progress">Loading PDF...</span>
          </div>
          <script src="https://cdn.jsdelivr.net/gh/pipwerks/PDFObject/pdfobject.min.js"></script>
          <script>
          const loadingLabel = document.querySelector('.loading-label')
          const loadingProgress = document.querySelector('#loading-progress')
          function progress({ loaded, total }) {
            loadingProgress.innerHTML = 'Loading PDF... ' + Math.round(loaded / total * 100) + '%'
          }

          fetch('${file['@microsoft.graph.downloadUrl']}').then(response => {
            if (!response.ok) {
              loadingLabel.innerHTML = '😟 ' + response.status + ' ' + response.statusText
              throw Error(response.status + ' ' + response.statusText)
            }
            if (!response.body) {
              loadingLabel.innerHTML = '😟 ReadableStream not yet supported in this browser.'
              throw Error('ReadableStream not yet supported in this browser.')
            }

            const contentEncoding = response.headers.get('content-encoding')
            const contentLength = response.headers.get(contentEncoding ? 'x-file-size' : 'content-length')
            if (contentLength === null) {
              oadingLabel.innerHTML = '😟 Response size header unavailable.'
              throw Error('Response size header unavailable')
            }

            const total = parseInt(contentLength, 10)
            let loaded = 0

            return new Response(
              new ReadableStream({
                start(controller) {
                  const reader = response.body.getReader()

                  read()
                  function read() {
                    reader.read().then(({ done, value }) => {
                      if (done) {
                        controller.close()
                        return
                      }
                      loaded += value.byteLength
                      progress({ loaded, total })
                      controller.enqueue(value)
                      read()
                    }).catch(error => {
                      console.error(error)
                      controller.error(error)
                    })
                  }
                }
              })
            )
          })
            .then(resp => resp.blob())
            .then(blob => {
              const pdfFile = new Blob([blob], { type: 'application/pdf' })
              const pdfFileUrl = URL.createObjectURL(pdfFile)
              loadingLabel.classList.add('fade-out-bck')

              setTimeout(() => {
                loadingLabel.remove()
                document.querySelector('#pdf-preview-wrapper').classList.add('fade-in-fwd')
                PDFObject.embed(pdfFileUrl, '#pdf-preview-wrapper', {
                  height: '80vh',
                  fallbackLink: '<p>😟 This browser does not support previewing PDF, please download the PDF directly using the button below.</p>'
                })
              }, 600)
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
