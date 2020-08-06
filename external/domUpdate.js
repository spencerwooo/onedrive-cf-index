import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'

async function renderReadme() {
  const resp = await fetch('readme.md')
  if (!resp.ok) return

  resp
    .text()
    .then(res => {
      document
        .querySelector('.container')
        .insertAdjacentHTML('beforeend', '<div class="markdown-body fade-in-bottom">' + window.marked(res) + '</div>')
      document.querySelector('.loading-label').classList.add('fade-out-bck')
      // eslint-disable-next-line no-undef
      Prism.highlightAll()
    })
    .catch(e => {
      document.querySelector('.loading-label').classList.add('fade-out-bck')
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="markdown-body fade-in-bottom">❌ <strong>Failed to render README:</strong> ${e}</div>`
        )
    })
}

renderReadme().catch(console.error)
