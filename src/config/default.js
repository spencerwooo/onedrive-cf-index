/* eslint-disable no-irregular-whitespace */
const config = {
  /**
   * You can use this tool http://heymind.github.io/tools/microsoft-graph-api-auth
   * to get following params: client_id, client_secret, refresh_token & redirect_uri.
   */
  refresh_token: REFRESH_TOKEN,
  client_id: '6600e358-9328-4050-af82-0af9cdde796b',
  client_secret: CLIENT_SECRET,
  redirect_uri: 'https://heymind.github.io/tools/microsoft-graph-api-auth',
  /**
   * The base path for indexing, all files and subfolders are public by this tool. For example `/Share`.
   */
  base: '/Public',
  /**
   * Feature Caching
   * Enable Cloudflare cache for path pattern listed below.
   * Cache rules:
   * - Entire File Cache  0 < file_size < entireFileCacheLimit
   * - Chunked Cache     entireFileCacheLimit  <= file_size < chunkedCacheLimit
   * - No Cache ( redirect to OneDrive Server )   others
   *
   * Difference between `Entire File Cache` and `Chunked Cache`
   *
   * `Entire File Cache` requires the entire file to be transferred to the Cloudflare server before
   *  the first byte sent to a client.
   *
   * `Chunked Cache` would stream the file content to the client while caching it.
   *  But there is no exact Content-Length in the response headers. ( Content-Length: chunked )
   *
   */
  cache: {
    enable: false,
    entireFileCacheLimit: 10000000, // 10MB
    chunkedCacheLimit: 100000000, // 100MB
    paths: ['/Images']
  },
  /**
   * Feature Thumbnail
   * Show a thumbnail of image by ?thumbnail=small (small,medium,large)
   * more details: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online#size-options
   * example: https://storage.idx0.workers.dev/Images/def.png?thumbnail=mediumSquare
   *
   */
  thumbnail: true,
  /**
   * Small File Upload ( <= 4MB )
   * example: POST https://storage.idx0.workers.dev/Images/?upload=<filename>&key=<secret_key>
   */
  upload: {
    enable: false,
    key: 'your_secret_1key_here'
  },
  /**
   * Feature Proxy Download
   * Use Cloudflare as a relay to speed up download. ( especially in Mainland China )
   * example: https://storage.idx0.workers.dev/Images/def.png?proxied
   */
  proxyDownload: true
}

export default config
