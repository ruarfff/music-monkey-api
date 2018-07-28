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
  passport.authenticate('spotify-guest', { failureRedirect: '/login' } as any),
  (req: Request, res: Response) => {
    const user = req.user

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
    const token = jwt.sign({ user }, 'super-secret-music-monkey')
    res.cookie('token', token, { expires: expiryDate })
    res.redirect('http://localhost:3000/callback')
  }
)

export default router
