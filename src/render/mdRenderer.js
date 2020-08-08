import marked from 'marked'

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
