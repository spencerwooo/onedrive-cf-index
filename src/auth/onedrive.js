import config from '../config/default'

/**
 * Get access token for microsoft graph API endpoints. Refresh token if needed.
 */
export async function getAccessToken() {
  const timestamp = () => {
    return Math.floor(Date.now() / 1000)
  }

  // Fetch access token
  const data = await BUCKET.get('onedrive', 'json')
  if (data && data.access_token && timestamp() < data.expire_at) {
    console.log('Fetched token from storage.')
    return data.access_token
  }

  // Token expired, refresh access token with Microsoft API. Both international and china-specific API are supported
  const oneDriveAuthEndpoint = `${config.apiEndpoint.auth}/token`

  const resp = await fetch(oneDriveAuthEndpoint, {
    method: 'POST',
    body: `client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&client_secret=${config.client_secret}
    &refresh_token=${config.refresh_token}&grant_type=refresh_token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (resp.ok) {
    console.info('Successfully refreshed access_token.')
    const data = await resp.json()

    // Update expiration time on token refresh
    data.expire_at = timestamp() + data.expires_in

    await BUCKET.put('onedrive', JSON.stringify(data))
    console.info('Successfully updated access_token.')

    // Finally, return access token
    return data.access_token
  } else {
    // eslint-disable-next-line no-throw-literal
    throw `getAccessToken error ${JSON.stringify(await resp.text())}`
  }
}

/**
 * Get & store siteID for finding sharepoint resources
 *
 * @param {string} accessToken token for accessing graph API
 */
export async function getSiteID(accessToken) {
  let data = await BUCKET.get('sharepoint', 'json')
  if (!data) {
    const resp = await fetch(`${config.apiEndpoint.graph}${config.baseResource}?$select=id`, {
      headers: {
        Authorization: `bearer ${accessToken}`
      }
    })
    if (resp.ok) {
      data = await resp.json()
      console.log('Got & stored site-id.')
      await BUCKET.put('sharepoint', JSON.stringify({ id: data.id }))
    }
  }
  return data.id
}
