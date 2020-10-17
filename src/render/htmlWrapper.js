import { favicon } from './favicon'

const COMMIT_HASH = '89afde99425f90047d6cde015bb90ab7d5b64b2f'

const pagination = (pIdx, attrs) => {
  const getAttrs = (c, h, isNext) =>
    `class="${c}" ${h ? `href="pagination?page=${h}"` : ''} ${
      isNext === undefined ? '' : `onclick="handlePagination(${isNext})"`
    }`
  if (pIdx) {
    switch (pIdx) {
      case pIdx < 0 ? pIdx : null:
        attrs = [getAttrs('pre', -pIdx - 1, 0), getAttrs('next off', null)]
        break
      case 1:
        attrs = [getAttrs('pre off', null), getAttrs('next', pIdx + 1, 1)]
        break
      default:
        attrs = [getAttrs('pre', pIdx - 1, 0), getAttrs('next', pIdx + 1, 1)]
    }
    return `${`<a ${attrs[0]}><i class="fas fa-arrow-left"></i></a>`} &nbsp;${`<a ${attrs[1]}><i class="fas fa-arrow-right"></i></a>`}`
  }
  return ''
}

export function renderHTML(body, pLink, pIdx) {
  pLink = pLink ? pLink : ''
  const p = 'window[pLinkId]'

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge, chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <title>Spencer's OneDrive</title>
      <link rel="shortcut icon" type="image/png" sizes="16x16" href="${favicon}" />
      <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.1/css/all.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/spencerwooo/onedrive-cf-index@${COMMIT_HASH}/themes/spencer.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@gh-pages/github-markdown.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/spencerwooo/onedrive-cf-index@${COMMIT_HASH}/themes/prism-github.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.17.1/prism.min.js" data-manual></script>
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.17.1/plugins/autoloader/prism-autoloader.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/turbolinks@5.2.0/dist/turbolinks.min.js"></script>
      <style>.paginate-container a.off {pointer-events: none;opacity: 0.5;}</style>
    </head>
    <body>
      <nav id="navbar" data-turbolinks-permanent><div class="brand">📁 Spencer's OneDrive Index</div></nav>
      ${body}
      <div class='paginate-container' style="margin-top: 0.5em">${pagination(pIdx)}</div>
      <div id="flex-container" data-turbolinks-permanent style="flex-grow: 1;"></div>
      <footer id="footer" data-turbolinks-permanent><p>Powered by <a href="https://github.com/spencerwooo/onedrive-cf-index">onedrive-cf-index</a>, hosted on <a href="https://www.cloudflare.com/products/cloudflare-workers/">Cloudflare Workers</a>.</p></footer>
      <script>
        if (typeof ap !== "undefined" && ap.paused !== true) {
          ap.pause()
        }
        Prism.highlightAll()
        mediumZoom('[data-zoomable]')
        if ('${pLink}') {
          if (!window.pLinkId) history.pushState(history.state, '', location.pathname.replace('pagination', ''))
          if (location.pathname.endsWith('/')) {
            pLinkId = history.state.turbolinks.restorationIdentifier
            ${p} = [['${pLink}'], 1]
          }
          if (${p}[0].length < ${p}[1]) (${p} = [[...${p}[0], '${pLink}'], ${p}[1]])
        }
        function handlePagination(isNext) {
          isNext ? ${p}[1]++ : ${p}[1]--
          addEventListener(
            'turbolinks:request-start',
            event => {
              const xhr = event.data.xhr
              xhr.setRequestHeader('pLink', ${p}[0][${p}[1] -2])
              xhr.setRequestHeader('pIdx', ${p}[1] + '')
            },
            { once: true }
          )
        }
        Turbolinks.start()
      </script>
    </body>
  </html>`
}
