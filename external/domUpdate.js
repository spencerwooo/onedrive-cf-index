import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'

async function renderReadme() {
  const resp = await fetch('readme.md')
  if (!resp.ok) return

  // Current directory contains README.md, load with spinner
  const loadingLabel = `<div class="loading-label fade-out-top">
                          <i class="fas fa-spinner fa-pulse"></i>
                          <span>Loading <code>README.md</code></span>
                        </div>`

  document.querySelector('.container').insertAdjacentHTML('beforeend', loadingLabel)
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

function humanFileSize(bytes, si) {
  bytes = parseInt(bytes, 10)
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a.item').forEach(function(i) {
    i.insertAdjacentHTML(
      'beforeend',
      '<div style="flex-grow:1"></div>' +
        (i.hasAttribute('size') ? '<span class="size">' + humanFileSize(i.getAttribute('size'), true) + '</span>' : '')
    )
  })
})

renderReadme().catch(console.error)
