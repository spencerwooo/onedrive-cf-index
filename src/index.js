import config from './config/default'
import { AUTH_ENABLED, NAME, ENABLE_PATHS } from './auth/config'
import { parseAuthHeader, unauthorizedResponse } from './auth/credentials'
import { getAccessToken, getSiteID } from './auth/onedrive'
import { handleFile, handleUpload } from './files/load'
import { extensions } from './render/fileExtension'
import { renderFolderView } from './folderView'
import { renderFilePreview } from './fileView'

addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  if (AUTH_ENABLED === false) {
    return handleRequest(request)
  }

  if (AUTH_ENABLED === true) {
    const pathname = decodeURIComponent(new URL(request.url).pathname).toLowerCase()
    const privatePaths = ENABLE_PATHS.map(i => i.toLowerCase())

    if (privatePaths.filter(p => pathname.toLowerCase().startsWith(p)).length > 0 || /__Lock__/gi.test(pathname)) {
      const credentials = parseAuthHeader(request.headers.get('Authorization'))

      if (!credentials || credentials.name !== NAME || credentials.pass !== AUTH_PASSWORD) {
        return unauthorizedResponse('Unauthorized')
      }

      return handleRequest(request)
    } else {
      return handleRequest(request)
    }
  } else {
    console.info('Auth error unexpected.')
  }
}

// Cloudflare cache instance
const cache = caches.default
const base = encodeURI(config.base).replace(/\/$/, '')

/**
 * Format and regularize directory path for OneDrive API
 *
 * @param {string} pathname The absolute path to file
 * @param {boolean} isRequestFolder is indexing folder or not
 */
function wrapPathName(pathname, isRequestFolder) {
  pathname = base + pathname
  const isIndexingRoot = pathname === '/'
  if (isRequestFolder) {
    if (isIndexingRoot) return ''
    return `:${pathname.replace(/\/$/, '')}:`
  }
  return `:${pathname}`
}

async function handleRequest(request) {
  if (config.cache && config.cache.enable) {
    const maybeResponse = await cache.match(request)
    if (maybeResponse) return maybeResponse
  }

  const accessToken = await getAccessToken()
  if (config.type.driveType) {
    config.baseResource = `/sites/${await getSiteID(accessToken)}/drive`
  }

  const { pathname, searchParams } = new URL(request.url)
  const neoPathname = pathname.replace(/pagination$/, '')
  const isRequestFolder = pathname.endsWith('/') || searchParams.get('page')

  const rawFile = searchParams.get('raw') !== null
  const thumbnail = config.thumbnail ? searchParams.get('thumbnail') : false
  const proxied = config.proxyDownload ? searchParams.get('proxied') !== null : false

  if (thumbnail) {
    const url = `${config.apiEndpoint.graph}${config.baseResource}/root${wrapPathName(
      neoPathname,
      isRequestFolder
    )}:/thumbnails/0/${thumbnail}/content`
    const resp = await fetch(url, {
      headers: {
        Authorization: `bearer ${accessToken}`
      }
    })

    return await handleFile(request, pathname, resp.url, {
      proxied
    })
  }

  let url = `${config.apiEndpoint.graph}${config.baseResource}/root${wrapPathName(neoPathname, isRequestFolder)}${
    isRequestFolder
      ? '/children' + (config.pagination.enable && config.pagination.top ? `?$top=${config.pagination.top}` : '')
      : '?select=%40microsoft.graph.downloadUrl,name,size,file'
  }`

  // get & set {pLink ,pIdx} for fetching and paging
  const paginationLink = request.headers.get('pLink')
  const paginationIdx = request.headers.get('pIdx') - 0

  if (paginationLink && paginationLink !== 'undefined') {
    url += `&$skiptoken=${paginationLink}`
  }

  const resp = await fetch(url, {
    headers: {
      Authorization: `bearer ${accessToken}`
    }
  })

  let error = null
  if (resp.ok) {
    const data = await resp.json()
    if (data['@odata.nextLink']) {
      request.pIdx = paginationIdx || 1
      request.pLink = data['@odata.nextLink'].match(/&\$skiptoken=(.+)/)[1]
    } else if (paginationIdx) {
      request.pIdx = -paginationIdx
    }
    if ('file' in data) {
      // Render file preview view or download file directly
      const fileExt = data.name
        .split('.')
        .pop()
        .toLowerCase()

      // Render file directly if url params 'raw' are given
      if (rawFile || !(fileExt in extensions)) {
        return await handleFile(request, pathname, data['@microsoft.graph.downloadUrl'], {
          proxied,
          fileSize: data.size
        })
      }

      // Add preview by CloudFlare worker cache feature
      let cacheUrl = null
      if (config.cache.enable && config.cache.previewCache && data.size < config.cache.chunkedCacheLimit) {
        cacheUrl = request.url + '?proxied&raw'
      }

      return new Response(await renderFilePreview(data, pathname, fileExt, cacheUrl || null), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'text/html'
        }
      })
    } else {
      // Render folder view, list all children files
      if (config.upload && request.method === 'POST') {
        const filename = searchParams.get('upload')
        const key = searchParams.get('key')
        if (filename && key && config.upload.key === key) {
          return await handleUpload(request, neoPathname, filename)
        } else {
          return new Response('', {
            status: 400
          })
        }
      }

      // 302 all folder requests that doesn't end with /
      if (!isRequestFolder) {
        return Response.redirect(request.url + '/', 302)
      }

      return new Response(await renderFolderView(data.value, neoPathname, request), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'text/html'
        }
      })
    }
  } else {
    error = (await resp.json()).error
  }

  if (error) {
    const body = JSON.stringify(error)
    switch (error.code) {
      case 'itemNotFound':
        return new Response(body, {
          status: 404,
          headers: {
            'content-type': 'application/json'
          }
        })
      default:
        return new Response(body, {
          status: 500,
          headers: {
            'content-type': 'application/json'
          }
        })
    }
  }
}
