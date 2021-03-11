/**
 * Basic authentication.
 * Enabled by default, you need to set PASSWORD secret using `wrangler secret put AUTH_PASSWORD`
 *
 * AUTH_ENABLED   `false` to disable it
 * NAME           user name
 * DISABLE_PATHS  disable protection on specific files
 * ENABLE_PATHS   enable protection on specific folders
 */
export const AUTH_ENABLED = true
export const NAME = 'guest'

export const DISABLE_PATHS = ['/favicon.ico', '/robots.txt']
export const ENABLE_PATHS = ['/🌞 Private folder/Private folder']

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 */

export const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/

/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 */

export const USER_PASS_REGEXP = /^([^:]*):(.*)$/
