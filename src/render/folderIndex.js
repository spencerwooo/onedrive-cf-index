import { getClassNameForMimeType, getClassNameForFilename } from 'font-awesome-filetypes'
import { renderHTML } from './html'

/**
 * Return absolute path of current working directory
 *
 * @param {array} pathItems List of current directory items
 * @param {number} idx Current depth inside home
 */
function getPathLink(pathItems, idx) {
  const pathList = pathItems.slice(0, idx + 1)

  if (pathList.length === 1) {
    return '/'
  }

  pathList[0] = ''
  return pathList.join('/')
}

/**
 * Render directory breadcrumb
 *
 * @param {string} path current working directory, for instance: /🥑 Course PPT for CS (BIT)/2018 - 大三上 - 操作系统/
 */
function renderPath(path) {
  const pathItems = path.split('/')
  pathItems[0] = '/'
  pathItems.pop()

  const link = (href, content) => `<a href="${href}">${content}</a>`
  const breadcrumb = []
  pathItems.forEach((item, idx) => {
    breadcrumb.push(link(getPathLink(pathItems, idx), idx === 0 ? '🚩 Home' : decodeURIComponent(item)))
  })
  console.log(breadcrumb.join(' / '))

  return breadcrumb.join(' / ')
}

/**
 * Render Folder Index
 *
 * @param {*} items
 * @param {*} isIndex don't show ".." on index page.
 */
export function renderFolderIndex(items, isIndex, path) {
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
        div('path', renderPath(path)) +
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
          ) +
          (isIndex ? intro : '')
      )
  )
}
