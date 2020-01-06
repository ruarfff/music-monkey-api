export const jwtCookieKey = 'super-super-secret-mm'

export const devCookieOpts = {}
export const prodCookieOpts = { httpOnly: true, secure: true, sameSite: true }

export const spotifyScopes = [
  'user-read-private',
  'user-read-email',
  'user-read-birthdate',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
  'user-library-read'
]
