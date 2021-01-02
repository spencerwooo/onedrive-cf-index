import marked from 'marked'

import { renderHTML } from './render/htmlWrapper'
import { renderPath } from './render/pathUtil'
import { renderMarkdown } from './render/mdRenderer'

import { preview, extensions } from './render/fileExtension'

/**
 * Render code blocks with the help of marked and Markdown grammar
 *
 * @param {Object} file Object representing the code file to preview
 * @param {string} lang The markdown code language string, usually just the file extension
 */
async function renderCodePreview(file, lang) {
  const resp = await fetch(file['@microsoft.graph.downloadUrl'])
  const content = await resp.text()
  const toMarkdown = `\`\`\`${lang}\n${content}\n\`\`\``
  const renderedCode = marked(toMarkdown)
  return `<div class="markdown-body" style="margin-top: 0;">
            ${renderedCode}
          </div>`
}

/**
 * Render PDF with built-in PDF viewer
 *
 * @param {Object} file Object representing the PDF to preview
 */
function renderPDFPreview(file) {
  return `<div id="pdf-preview-wrapper"></div>
          <div class="loading-label">
            <i class="fas fa-spinner fa-pulse"></i>
            <span id="loading-progress">Loading PDF...</span>
          </div>
          <script>
          // No variable declaration. Described in https://github.com/spencerwooo/onedrive-cf-index/pull/46
          loadingLabel = document.querySelector('.loading-label')
          loadingProgress = document.querySelector('#loading-progress')
          function progress({ loaded, total }) {
            loadingProgress.innerHTML = 'Loading PDF... ' + Math.round(loaded / total * 100) + '%'
          }

          fetch('${file['@microsoft.graph.downloadUrl']}').then(response => {
            if (!response.ok) {
              loadingLabel.innerHTML = '😟 ' + response.status + ' ' + response.statusText
              throw Error(response.status + ' ' + response.statusText)
            }
            if (!response.body) {
              loadingLabel.innerHTML = '😟 ReadableStream not yet supported in this browser. Please download the PDF directly using the button below.'
              throw Error('ReadableStream not yet supported in this browser.')
            }

            const contentEncoding = response.headers.get('content-encoding')
            const contentLength = response.headers.get(contentEncoding ? 'x-file-size' : 'content-length')
            if (contentLength === null) {
              loadingProgress.innerHTML = 'Loading progress unavailable. Please wait or download the PDF directly using the button below.'
              console.error('Response size header unavailable')
              return response
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

/**
 * Render image (jpg, png or gif)
 *
 * @param {Object} file Object representing the image to preview
 */
function renderImage(file) {
  return `<div class="image-wrapper">
            <img data-zoomable src="${file['@microsoft.graph.downloadUrl']}" alt="${file.name}" style="width: 100%; height: auto; position: relative;"></img>
          </div>`
}

/**
 * Render video (mp4, flv, m3u8, webm ...)
 *
 * @param {Object} file Object representing the video to preview
 */
function renderVideoPlayer(file) {
  return `<div id="dplayer"></div>
          <script>
          new DPlayer({
            container: document.getElementById('dplayer'),
            theme: '#0070f3',
            video: {
              url: '${file['@microsoft.graph.downloadUrl']}',
              type: 'auto'
            }
          })
          </script>`
}

/**
 * Render audio (mp3, aac, wav, oga ...)
 *
 * @param {Object} file Object representing the audio to preview
 */
function renderAudioPlayer(file) {
  return `<div id="aplayer"></div>
          <script>
          new APlayer({
            container: document.getElementById('aplayer'),
            theme: '#0070f3',
            audio: [{
              name: '${file.name}',
              url: '${file['@microsoft.graph.downloadUrl']}'
            }]
          })
          </script>`
}

/**
 * File preview fallback
 *
 * @param {string} fileExt The file extension parsed
 */
function renderUnsupportedView(fileExt) {
  return `<div class="markdown-body" style="margin-top: 0;">
            <p>Sorry, we don't support previewing <code>.${fileExt}</code> files as of today. You can download the file directly.</p>
          </div>`
}

/**
 * Render preview of supported file format
 *
 * @param {Object} file Object representing the file to preview
 * @param {string} fileExt The file extension parsed
 */
async function renderPreview(file, fileExt) {
  switch (extensions[fileExt]) {
    case preview.markdown:
      return await renderMarkdown(file['@microsoft.graph.downloadUrl'], '', 'style="margin-top: 0;"')

    case preview.text:
      return await renderCodePreview(file, '')

    case preview.image:
      return renderImage(file)

    case preview.code:
      return await renderCodePreview(file, fileExt)

    case preview.pdf:
      return renderPDFPreview(file)

    case preview.video:
      return renderVideoPlayer(file)

    case preview.audio:
      return renderAudioPlayer(file)

    default:
      return renderUnsupportedView(fileExt)
  }
}

export async function renderFilePreview(file, path, fileExt) {
  const el = (tag, attrs, content) => `<${tag} ${attrs.join(' ')}>${content}</${tag}>`
  const div = (className, content) => el('div', [`class=${className}`], content)

  const body = div(
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
