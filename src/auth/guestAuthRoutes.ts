import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import IUser from '../user/IUser'
import UserService from '../user/UserService'
import { spotifyScopes } from './authConstants'
import { handleCallback, setJwtCookie } from './authRequestLib'

const router = Router()
const userService = new UserService()
const guestsUrl = 'https://guests.musicmonkey.io'
const devUrl = 'http://localhost:3002'

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
  '/spotify-guest-local-dev',
  passport.authenticate('spotify-guest-local-dev', {
    scope: spotifyScopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication
  }
)

router.get(
  '/guest/spotify/callback/local/dev',
  passport.authenticate('spotify-guest-local-dev', {
    failureRedirect: devUrl + '/login',
    session: false
  } as any),
  handleCallback(devUrl)
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
  '/facebook-guest-local-dev',
  passport.authenticate('facebook-guest-local-dev', {
    scope: ['email']
  } as any),
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
  '/guest/facebook/callback/local/dev',
  passport.authenticate('facebook-guest-local-dev', {
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

router.post('/login-guest', (req: Request, res: Response) => {
  userService
    .createGuest()
    .then((user: IUser) => {
      setJwtCookie(res, user.userId, req.get('env'))
      res.status(200).send()
    })
    .catch((err: any) => {
      const code = err.statusCode || 400
      res.status(code).send(err.message)
    })
})

export default router
