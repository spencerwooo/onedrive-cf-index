import config from '../config/default'

/**
 * Current access token
 */
let _accessToken = null

/**
 * Get access token for microsoft graph API endpoints. Refresh token if needed.
 */
export async function getAccessToken() {
  if (_accessToken) return _accessToken
  const resp = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    body: `client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&client_secret=${config.client_secret}
    &refresh_token=${config.refresh_token}&grant_type=refresh_token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (resp.ok) {
    console.info('access_token refresh success.')
    const data = await resp.json()
    _accessToken = data.access_token
    return _accessToken
  } else {
    // eslint-disable-next-line no-throw-literal
    throw `getAccessToken error ${JSON.stringify(await resp.text())}`
  }
}
