import { Request, Response, Router } from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'

const router = Router()

const guestsUrl = 'https://guests.musicmonkey.io'
const devUrl = 'http://localhost:3000/'

const spotifyScopes = [
  'user-read-private',
  'user-read-email',
  'user-read-birthdate',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read'
]

router.get(
  '/spotify-guest',
  passport.authenticate('spotify-guest', {
    scope: spotifyScopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication
  }
)

router.get(
  '/spotify-guest-local',
  passport.authenticate('spotify-guest-local', {
    scope: spotifyScopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication
  }
)

router.get(
  '/guest/spotify/callback/local',
  passport.authenticate('spotify-guest-local', {
    failureRedirect: devUrl + '/login',
    session: false
  } as any),
  handleCallback(devUrl)
)

router.get(
  '/guest/spotify/callback',
  passport.authenticate('spotify-guest', {
    failureRedirect: guestsUrl + '/login',
    session: false
  } as any),
  handleCallback(guestsUrl)
)

router.get(
  '/facebook-guest',
  passport.authenticate('facebook-guest', { scope: ['email'] } as any),
  () => {
    // The request will be redirected to facebook for authentication
  }
)

router.get(
  '/facebook-guest-local',
  passport.authenticate('facebook-guest-local', { scope: ['email'] } as any),
  () => {
    // The request will be redirected to facebook for authentication
  }
)

router.get(
  '/guest/facebook/callback/local',
  passport.authenticate('facebook-guest-local', {
    failureRedirect: devUrl + '/login',
    session: false
  } as any),
  handleCallback(devUrl)
)

router.get(
  '/guest/facebook/callback',
  passport.authenticate('facebook-guest', {
    failureRedirect: guestsUrl + '/login',
    session: false
  } as any),
  handleCallback(guestsUrl)
)

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    res.status(200).send(user)
  }
)

router.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  (_req: Request, res: Response) => {
    res.clearCookie('jwt')
    res.status(200).send()
  }
)

function handleCallback(redirectUrl: string) {
  return (req: Request, res: Response) => {
    const user = req.user
    const token = jwt.sign({ id: user.userId }, 'super-super-secret-mm')
    if (req.get('env') === 'production') {
      res.cookie('jwt', token, { httpOnly: true, secure: true })
    } else {
      res.cookie('jwt', token, {})
    }
    res.redirect(redirectUrl)
  }
}

export default router
