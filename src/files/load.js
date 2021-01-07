import config from '../config/default'
import { getAccessToken } from '../auth/onedrive'

/**
 * Cloudflare cache instance
 */
const cache = caches.default

/**
 * Cache downloadUrl according to caching rules.
 * @param {Request} request client's request
 * @param {integer} fileSize
 * @param {string} downloadUrl
 * @param {function} fallback handle function if the rules is not satisfied
 */
async function setCache(request, fileSize, downloadUrl, fallback) {
  if (fileSize < config.cache.entireFileCacheLimit) {
    console.info(`Cache entire file ${request.url}`)
    const remoteResp = await fetch(downloadUrl)
    const resp = new Response(remoteResp.body, {
      headers: {
        'Content-Type': remoteResp.headers.get('Content-Type'),
        ETag: remoteResp.headers.get('ETag')
      },
      status: remoteResp.status,
      statusText: remoteResp.statusText
    })
    await cache.put(request, resp.clone())
    return resp
  } else if (fileSize < config.cache.chunkedCacheLimit) {
    console.info(`Chunk cache file ${request.url}`)
    const remoteResp = await fetch(downloadUrl)
    const { readable, writable } = new TransformStream()
    remoteResp.body.pipeTo(writable)
    const resp = new Response(readable, {
      headers: {
        'Content-Type': remoteResp.headers.get('Content-Type'),
        ETag: remoteResp.headers.get('ETag')
      },
      status: remoteResp.status,
      statusText: remoteResp.statusText
    })
    await cache.put(request, resp.clone())
    return resp
  } else {
    console.info(`No cache ${request.url} because file_size(${fileSize}) > limit(${config.cache.chunkedCacheLimit})`)
    return await fallback(downloadUrl)
  }
}

/**
 * Redirect to the download url.
 * @param {string} downloadUrl
 */
async function directDownload(downloadUrl) {
  console.info(`DirectDownload -> ${downloadUrl}`)
  return new Response(null, {
    status: 302,
    headers: {
      Location: downloadUrl.slice(6)
    }
  })
}

/**
 * Download a file using Cloudflare as a relay.
 * @param {string} downloadUrl
 */
async function proxiedDownload(downloadUrl) {
  console.info(`ProxyDownload -> ${downloadUrl}`)
  const remoteResp = await fetch(downloadUrl)
  const { readable, writable } = new TransformStream()
  remoteResp.body.pipeTo(writable)
  return new Response(readable, remoteResp)
}

export async function handleFile(request, pathname, downloadUrl, { proxied = false, fileSize = 0 }) {
  if (config.cache && config.cache.enable && config.cache.paths.filter(p => pathname.startsWith(p)).length > 0) {
    return setCache(request, fileSize, downloadUrl, proxied ? proxiedDownload : directDownload)
  }
  return (proxied ? proxiedDownload : directDownload)(downloadUrl)
}

export async function handleUpload(request, pathname, filename) {
  const url = `${config.apiEndpoint.graph}/v1.0/me/drive/root:${encodeURI(config.base) +
    (pathname.slice(-1) === '/' ? pathname : pathname + '/')}${filename}:/content`
  return await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `bearer ${await getAccessToken()}`,
      ...request.headers
    },
    body: request.body
  })
}
