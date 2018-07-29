import { Request, Response, Router } from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'

const router = Router()

const scopes = [
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
    scope: scopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
)

router.get(
  '/guest/callback',
  passport.authenticate('spotify-guest', {
    failureRedirect: 'http://localhost:3000/login',
    session: false
  } as any),
  (req: Request, res: Response) => {
    const user = req.user
    const token = jwt.sign({ user }, 'super-super-secret-mm')
    res.cookie('jwt', token, { httpOnly: true, secure: true })
    res.redirect('http://localhost:3000/')
  }
)

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    res.status(200).send(user.user)
  }
)

export default router
