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
  return pathList.join('/') + '/'
}

/**
 * Render directory breadcrumb
 *
 * @param {string} path current working directory, for instance: /🥑 Course PPT for CS (BIT)/2018 - 大三上 - 操作系统/
 */
export function renderPath(path) {
  const pathItems = path.split('/')
  pathItems[0] = '/'
  pathItems.pop()

  const link = (href, content) => `<a href="${href}">${content}</a>`
  const breadcrumb = []
  pathItems.forEach((item, idx) => {
    breadcrumb.push(link(getPathLink(pathItems, idx), idx === 0 ? '🚩 Home' : decodeURIComponent(item)))
  })

  return breadcrumb.join(' / ')
}
