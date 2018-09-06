import * as bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import { isEmpty } from 'lodash'
import * as passport from 'passport'
import { logError } from '../logging'
import { refreshToken } from '../spotify/spotifyClient'
import IUser from '../user/IUser'
import { checkUserProfile } from '../user/profileCheck'
import { createNewUser } from '../user/userService'
import { setJwtCookie } from './authRequestLib'

const devCookieOpts = {}
const prodCookieOpts = { httpOnly: true, secure: true }
const isProduction = process.env.NODE_ENV === 'production'
const router = Router()

router.post(
  '/refresh',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      const { spotifyAuth } = await refreshToken(user)
      res.send(spotifyAuth)
    } catch (err) {
      logError('Error refreshing token', err, req)
      res.status(400).send(err.message)
    }
  }
)

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user } = req
    const checkedUser = await checkUserProfile(user)
    res.status(200).send(checkedUser)
  }
)

router.get('/logout', (_req: Request, res: Response) => {
  if (isProduction) {
    res.clearCookie('jwt', prodCookieOpts)
  } else {
    res.clearCookie('jwt', devCookieOpts)
  }
  res.status(200).send()
})

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      res.status(401).send('Invalid email or password')
    } else {
      req.login(user, { session: false }, (loginErr: any) => {
        if (loginErr) {
          res.status(400).send({ loginErr })
        } else {
          setJwtCookie(res, user.userId)
          res.status(200).send()
        }
      })
    }
  })(req, res)
})

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const hashCost = 10
    if (isEmpty(password) || password.length > 256) {
      throw new Error('Invalid Password.')
    }
    const passwordHash = await bcrypt.hash(password, hashCost)

    createNewUser({ email, passwordHash } as IUser)
      .then((user: IUser) => {
        setJwtCookie(res, user.userId)
        res.status(200).send()
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

export default router
