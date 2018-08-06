import * as bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import * as jwt from 'jsonwebtoken'
import { isEmpty } from 'lodash'
import * as passport from 'passport'
import { IUser } from '../model'
import UserService from '../user/UserService'

const router = Router()
const userService = new UserService()
const guestsUrl = 'https://guests.musicmonkey.io'
const devUrl = 'http://localhost:3000'

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

router.get('/guest-user', (req: Request, res: Response) => {
  userService
    .createGuest()
    .then((stuff: any) => {
      console.log('Stuff', stuff)
      return handleCallback(devUrl)(req, res)
    })
    .catch((err: any) => {
      const code = err.statusCode || 400
      res.status(code).send(err.message)
    })
})

router.get('/logout', (_req: Request, res: Response) => {
  res.clearCookie('jwt')
  res.status(200).send()
})

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body.data

    // authentication will take approximately 13 seconds
    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
    const hashCost = 10
    if (isEmpty(password) || password.length > 256) {
      throw new Error('Invalid Password.')
    }
    const passwordHash = await bcrypt.hash(password, hashCost)
    userService
      .createNewUser({ email, passwordHash } as IUser)
      .then((user: IUser) => {
        const token = jwt.sign({ id: user.userId }, 'super-super-secret-mm')
        if (req.get('env') === 'production') {
          res.cookie('jwt', token, { httpOnly: true, secure: true })
        } else {
          res.cookie('jwt', token, {})
        }

        res.status(200).send(user)
      })
      .catch((err: any) => {
        res.status(400).send(err)
      })
  } catch (error) {
    res.status(400).send({
      error: 'req body should take the form { email, password }'
    })
  }
})

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
