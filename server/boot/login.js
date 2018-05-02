const userGateway = require('../../src/user/userGateway')
const SpotifyWebApi = require('spotify-web-api-node')
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-birthdate',
  'playlist-modify-public',
  'playlist-modify-private'
]
const callbackEndpoint = '/callback'
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'

module.exports = function(app) {
  var router = app.loopback.Router()
  router.get('/login', (req, res) => {
    const redirectURL = getRedirectUrl(req)
    console.log('RedirectURL: ', redirectURL)
    const spotifyApi = new SpotifyWebApi({
      redirectUri: redirectURL,
      clientId: clientId
    })
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes)
    res.redirect(authorizeURL)
  })
  router.get('/callback', (req, res) => {
    const redirectURL = getRedirectUrl(req)
    const code = req.query.code
    const redirectTo = req.query.redirectTo
    const credentials = {
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectURL
    }
    console.log('Creds: ', JSON.stringify(credentials, null, 4))
    console.log('Code: ', code)
    const spotifyApi = new SpotifyWebApi(credentials)
    spotifyApi.authorizationCodeGrant(code).then(
      data => {
        res.redirect(redirectTo + '?rt=' + data.body['refresh_token'])
      },
      err => {
        console.log('Something went wrong!', err)
        res.status(500).send(err)
      }
    )
  })
  router.post('/refresh', (req, res) => {
    const redirectUrl = getRedirectUrl(req)
    const spotifyApi = new SpotifyWebApi({
      redirectUri: redirectUrl,
      clientId: clientId,
      clientSecret: clientSecret
    })
    const refreshToken = req.body.refreshToken
    spotifyApi.setRefreshToken(refreshToken)

    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        )
        const token = data.body['access_token']
        const expiresIn = data.body['expires_in']
        spotifyApi.setAccessToken(token)
        getOrCreateUser(spotifyApi, refreshToken, token, expiresIn)
          .then(response => {
            res.send(response)
          })
          .catch(err => res.status(401).send(err))
      })
      .catch(err =>
        res.status(500).send({
          error: 'Could not refresh access token: ' + JSON.stringify(err)
        })
      )
  })
  app.use(router)
}

function getRedirectUrl(req) {
  return (
    'http://' +
    req.hostname +
    (req.hostname === 'localhost' ? ':8080' : '') +
    callbackEndpoint +
    (req.query.redirectTo ? '?redirectTo=' + req.query.redirectTo : '')
  )
}

function getOrCreateUser(spotifyApi, refreshToken, accessToken, expiresIn) {
  return new Promise((resolve, reject) => {
    spotifyApi
      .getMe()
      .then(data => {
        userGateway
          .getUserByEmail(data.body)
          .then(savedUser => {
            resolve(savedUser)
          })
          .catch(err => {
            console.log('Could not find user ' + data.body.email, err)
            // Try create the user
            const spotifyUser = data.body
            const user = {
              displayName: spotifyUser.display_name,
              email: spotifyUser.email,
              country: spotifyUser.country,
              birthdate: spotifyUser.birthdate,
              image:
                spotifyUser.images && spotifyUser.images.length > 0
                  ? spotifyUser.images[0].url
                  : '',
              auth: {
                expiresIn: expiresIn,
                refreshToken: refreshToken,
                accessToken: accessToken
              }
            }
            userGateway
              .createUser(user)
              .then(resolve)
              .catch(reject)
          })
      })
      .catch(reject)
  })
}
