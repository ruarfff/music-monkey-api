import { Request, Response } from 'express'
import { IUser } from '../model'
import UserGateway from '../user/userGateway'

const SpotifyWebApi = require('spotify-web-api-node')

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-birthdate',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read'
]
const callbackEndpoint = '/callback'
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'
const userGateway = new UserGateway()

export default function(server: any) {
  const router = server.loopback.Router()

  router.get('/login', (req: Request, res: Response) => {
    let redirectTo = req.query.redirectTo
    let inviteParam = ''
    if (redirectTo && redirectTo.split('?').length > 1) {
      const inviteId = redirectTo.split('=')[1]
      inviteParam = 'invite=' + inviteId
      redirectTo = redirectTo.split('?')[0]
    }

    const redirectURL = getRedirectUrl(req.hostname, redirectTo)

    const spotifyApi = new SpotifyWebApi({
      clientId,
      redirectUri: redirectURL
    })
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, inviteParam)
    res.redirect(authorizeURL)
  })
  router.get('/callback', (req: Request, res: Response) => {
    const redirectURL = getRedirectUrl(req.hostname, req.query.redirectTo)
    const code = req.query.code
    const redirectTo = req.query.redirectTo
    const state = req.query.state
    const credentials = {
      clientId,
      clientSecret,
      redirectUri: redirectURL
    }
    const spotifyApi = new SpotifyWebApi(credentials)
    spotifyApi.authorizationCodeGrant(code).then(
      (data: any) => {
        let redirectUrl = redirectTo + '?rt=' + data.body.refresh_token
        if (state) {
          redirectUrl += '&' + state
        }
        res.redirect(redirectUrl)
      },
      (err: Error) => {
        res.status(500).send(err)
      }
    )
  })
  router.post('/refresh', (req: Request, res: Response) => {
    const redirectUrl = getRedirectUrl(req.hostname, req.query.redirectTo)
    const spotifyApi = new SpotifyWebApi({
      clientId,
      clientSecret,
      redirectUri: redirectUrl
    })
    const refreshToken = req.body.refreshToken
    spotifyApi.setRefreshToken(refreshToken)

    spotifyApi
      .refreshAccessToken()
      .then((data: any) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        )
        const accessToken = data.body.access_token
        const expiresIn = data.body.expires_in
        spotifyApi.setAccessToken(accessToken)
        getOrCreateUser(spotifyApi, refreshToken, accessToken, expiresIn)
          .then(response => {
            res.send(response)
          })
          .catch(err => res.status(401).send(err))
      })
      .catch((err: Error) =>
        res.status(500).send({
          error: 'Could not refresh access token: ' + JSON.stringify(err)
        })
      )
  })

  server.use(router)
}

function getRedirectUrl(hostname: string, redirectTo: string) {
  return (
    (hostname === 'localhost' ? 'http://' : 'https://') +
    hostname +
    (hostname === 'localhost' ? ':8080' : '') +
    callbackEndpoint +
    (redirectTo ? '?redirectTo=' + redirectTo : '')
  )
}

function getOrCreateUser(
  spotifyApi: any,
  refreshToken: string,
  accessToken: string,
  expiresIn: number
) {
  const auth = {
    accessToken,
    expiresIn,
    refreshToken
  }

  return new Promise((resolve, reject) => {
    spotifyApi
      .getMe()
      .then((data: any) => {
        userGateway
          .getUserByEmail(data.body)
          .then((savedUser: any) => {
            savedUser.auth = auth
            resolve(savedUser)
          })
          .catch(() => {
            // Try create the user
            const spotifyUser = data.body
            const user = {
              auth,
              birthdate: spotifyUser.birthdate,
              country: spotifyUser.country,
              displayName: spotifyUser.display_name,
              email: spotifyUser.email,
              image:
                spotifyUser.images && spotifyUser.images.length > 0
                  ? spotifyUser.images[0].url
                  : '',
              spotifyId: spotifyUser.id
            } as IUser

            userGateway
              .createUser(user)
              .then(resolve)
              .catch((errt: Error) => {
                reject(errt)
              })
          })
      })
      .catch((err: Error) => {
        reject(err)
      })
  })
}
