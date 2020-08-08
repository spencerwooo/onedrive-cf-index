import marked from 'marked'
import { cleanUrl } from 'marked/src/helpers'

const renderer = new marked.Renderer()
// Rewrite renderer, see original at: https://github.com/markedjs/marked/blob/master/src/Renderer.js
renderer.image = (href, title, text) => {
  href = cleanUrl(false, null, href)
  if (href === null) {
    return text
  }

  let out = '<img src="' + href + '?raw=true" alt="' + text + '"'
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
