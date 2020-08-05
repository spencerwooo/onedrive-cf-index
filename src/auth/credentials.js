import { CREDENTIALS_REGEXP, USER_PASS_REGEXP } from './config'

/**
 * Object to represent user credentials.
 */
class Credentials {
  constructor(name, pass) {
    this.name = name
    this.pass = pass
  }
}

/**
 * Parse basic auth to object.
 */
export function parseAuthHeader(string) {
  if (typeof string !== 'string') {
    return undefined
  }

  // parse header
  const match = CREDENTIALS_REGEXP.exec(string)

  if (!match) {
    return undefined
  }

  // decode user pass
  const userPass = USER_PASS_REGEXP.exec(atob(match[1]))

  if (!userPass) {
    return undefined
  }

  // return credentials object
  return new Credentials(userPass[1], userPass[2])
}

export function unauthorizedResponse(body) {
  return new Response(null, {
    status: 401,
    statusText: "'Authentication required.'",
    body: body,
    headers: {
      'WWW-Authenticate': 'Basic realm="User Visible Realm"'
    }
  })
}
