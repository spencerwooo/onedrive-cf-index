import config from '../config/default'

const timestamp = () => {
  Math.floor(Date.now() / 1000)
}

/**
 * Get access token for microsoft graph API endpoints. Refresh token if needed.
 */
export async function getAccessToken() {
  // if (_accessToken) return _accessToken

  // Fetch access token from Google Firebase Database
  const data = await (
    await fetch(`https://onedrive-cf-refresh-token.firebaseio.com/auth.json?auth=${FIREBASE_TOKEN}`)
  ).json()
  if (data && data.access_token && timestamp() < data.expire_at) {
    return data.access_token
  }

  // Request new token via OneDrive OAuth2 API
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
    data.expire_at = timestamp() + data.expires_in
    const _accessToken = data.access_token
    return _accessToken
  } else {
    // eslint-disable-next-line no-throw-literal
    throw `getAccessToken error ${JSON.stringify(await resp.text())}`
  }
}
