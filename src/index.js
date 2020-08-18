import config from './config/default'
import { AUTH_ENABLED, NAME, PASS } from './auth/config'
import { parseAuthHeader, unauthorizedResponse } from './auth/credentials'
import { getAccessToken } from './auth/onedrive'
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
  } else if (AUTH_ENABLED === true) {
    const credentials = parseAuthHeader(request.headers.get('Authorization'))
    if (!credentials || credentials.name !== NAME || credentials.pass !== PASS) {
      return unauthorizedResponse('Unauthorized')
    } else {
      return handleRequest(request)
    }
  } else {
    console.info('Auth error unexpected.')
  }
}

// Cloudflare cache instance
const cache = caches.default

/**
 * Format and regularize directory path for OneDrive API
 *
 * @param {string} pathname The absolute path to file
 */
function wrapPathName(pathname) {
  pathname = config.base + (pathname === '/' ? '' : pathname)
  return pathname === '/' || pathname === '' ? '' : ':' + pathname
}

async function handleRequest(request) {
  if (config.cache && config.cache.enable) {
    const maybeResponse = await cache.match(request)
    if (maybeResponse) return maybeResponse
  }

  const base = config.base
  const accessToken = await getAccessToken()

  const { pathname, searchParams } = new URL(request.url)

  const rawImage = searchParams.get('raw')
  const thumbnail = config.thumbnail ? searchParams.get('thumbnail') : false
  const proxied = config.proxyDownload ? searchParams.get('proxied') !== null : false

  const isUseCnUrl = config.useOnedriveCN && 'microsoftgraph.chinacloudapi.cn' || 'graph.microsoft.com'

  if (thumbnail) {
    const url = `https://${ isUseCnUrl }/v1.0/me/drive/root:${base +
      (pathname === '/' ? '' : pathname)}:/thumbnails/0/${thumbnail}/content`
    const resp = await fetch(url, {
      headers: {
        Authorization: `bearer ${accessToken}`
      }
    })

    return await handleFile(request, pathname, resp.url, {
      proxied
    })
  }

  const url = `https://${ isUseCnUrl }/v1.0/me/drive/root${wrapPathName(
    pathname
  )}?select=name,eTag,size,id,folder,file,image,%40microsoft.graph.downloadUrl&expand=children`
  const resp = await fetch(url, {
    headers: {
      Authorization: `bearer ${accessToken}`
    }
  })

  let error = null
  if (resp.ok) {
    const data = await resp.json()

    if ('file' in data) {
      // Render file preview view or download file directly
      const fileExt = data.name.split('.').pop()

      // Render image directly if ?raw=true parameters are given
      if (rawImage || !(fileExt in extensions)) {
        return await handleFile(request, pathname, data['@microsoft.graph.downloadUrl'], {
          proxied,
          fileSize: data.size
        })
      }

      return new Response(await renderFilePreview(data, pathname, fileExt), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'text/html'
        }
      })
    } else if ('folder' in data) {
      // Render folder view, list all children files
      if (config.upload && request.method === 'POST') {
        const filename = searchParams.get('upload')
        const key = searchParams.get('key')
        if (filename && key && config.upload.key === key) {
          return await handleUpload(request, pathname, filename)
        } else {
          return new Response('', {
            status: 400
          })
        }
      }

      // 302 all folder requests that doesn't end with /
      if (!request.url.endsWith('/')) {
        return Response.redirect(request.url + '/', 302)
      }

      return new Response(await renderFolderView(data.children, pathname), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'text/html'
        }
      })
    } else {
      error = `unknown data ${JSON.stringify(data)}`
    }
  } else {
    error = (await resp.json()).error
  }

  if (error) {
    const body = JSON.stringify(error)
    switch (error.code) {
      case 'ItemNotFound':
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
