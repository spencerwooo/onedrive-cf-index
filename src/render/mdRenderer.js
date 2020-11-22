import marked from 'marked'
import { cleanUrl } from 'marked/src/helpers'

// Rewrite renderer, see original at: https://github.com/markedjs/marked/blob/master/src/Renderer.js
const renderer = new marked.Renderer()
renderer.image = (href, title, text) => {
  href = cleanUrl(false, null, href)
  if (href === null) {
    return text
  }
  let url
  try {
    // Check if href is relative
    url = new URL(href).href
  } catch (TypeError) {
    // Add param raw=true
    if (href.includes('?')) {
      const urlSplitParams = href.split('?')
      const param = new URLSearchParams(urlSplitParams[1])
      param.append('raw', true)
      url = urlSplitParams[0] + '?' + param.toString()
    } else {
      url = href + '?raw=true'
    }
  }
  let out = '<img data-zoomable src="' + url + '" alt="' + text + '"'
  if (title) {
    out += ' title="' + title + '"'
  }
  return (out += '>')
}
marked.setOptions({ renderer: renderer })

/**
 * Fetch and render Markdown files
 *
 * @param {string} mdDirectLink Markdown direct download link
 * @param {string} classAttr Class attribute for animations (like fade-in-fwd)
 * @param {string} style CSS inline styles for Markdown block
 */
export async function renderMarkdown(mdDirectLink, classAttr, style) {
  const resp = await fetch(mdDirectLink)
  const content = await resp.text()
  const renderedMd = marked(content)

  return `<div class="markdown-body ${classAttr}" ${style}>
            ${renderedMd}
          </div>`
}
