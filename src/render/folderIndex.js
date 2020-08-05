import { getClassNameForMimeType, getClassNameForFilename } from 'font-awesome-filetypes'
import { renderHTML } from './html'

/**
 * Render Folder Index
 * @param {*} items
 * @param {*} isIndex don't show ".." on index page.
 */
export function renderFolderIndex(items, isIndex) {
  const nav = '<nav><a class="brand">📁 Spencer\'s OneDrive Index</a></nav>'
  const el = (tag, attrs, content) => `<${tag} ${attrs.join(' ')}>${content}</${tag}>`
  const div = (className, content) => el('div', [`class=${className}`], content)
  const item = (icon, filename, size) =>
    el(
      'a',
      [`href="${filename}"`, 'class="item"', size ? `size="${size}"` : ''],
      el('i', [`class="far ${icon}"`], '') + filename
    )

  const intro = `<div class="intro" style="text-align: left; margin-top: 2rem;">
                    <h3>Yoo, I'm Spencer Woo 👋</h3>
                    <p>This is Spencer's OneDrive public directory listing. Feel free to download any files that you find useful. Reach me at: spencer.woo [at] outlook [dot] com.</p>
                    <p><a href="https://spencerwoo.com">Portfolio</a> · <a href="https://blog.spencerwoo.com">Blog</a> · <a href="https://github.com/spencerwooo">GitHub</a></p>
                  </div>`

  return renderHTML(
    nav +
    div(
      'container',
      div(
        'items',
        el(
          'div',
          ['style="min-width: 600px"'],
          (!isIndex ? item('fa-folder', '..') : '') +
          items
            .map(i => {
              if ('folder' in i) {
                return item('fa-folder', i.name, i.size)
              } else if ('file' in i) {
                // console.log(i.file.mimeType, getClassNameForMimeType(i.file.mimeType))
                let fileIcon = getClassNameForMimeType(i.file.mimeType)
                if (fileIcon === 'fa-file') {
                  fileIcon = getClassNameForFilename(i.name)
                }
                return item(fileIcon, i.name, i.size)
              } else console.log(`unknown item type ${i}`)
            })
            .join('')
        )
      ) + (isIndex ? intro : '')
    )
  )
}
