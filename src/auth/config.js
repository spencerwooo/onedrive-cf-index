/**
 * Basic authentication.
 * Disabled by default (Issue #29)
 *
 * AUTH_ENABLED   to enable auth set true
 * NAME           user name
 * PASS           password
 */
export const AUTH_ENABLED = false
export const NAME = 'admin'
export const PASS = 'password'

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
