import * as bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import { isEmpty } from 'lodash'
import * as passport from 'passport'
import { IUser } from '../model'
import UserService from '../user/UserService'
import { setJwtCookie } from './authRequestLib'

const devCookieOpts = {}
const prodCookieOpts = { httpOnly: true, secure: true }

const router = Router()
const userService = new UserService()

router.post(
  '/refresh',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    res.status(200).send(user.spotifyAuth)
  }
)

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    res.status(200).send(user)
  }
)

router.get('/logout', (req: Request, res: Response) => {
  if (req.get('env') === 'production') {
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
    }

    req.login(user, { session: false }, (loginErr: any) => {
      if (loginErr) {
        res.status(400).send({ loginErr })
      }
      setJwtCookie(res, user.userId, req.get('env'))
      res.status(200).send()
    })
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
    userService
      .createNewUser({ email, passwordHash } as IUser)
      .then((user: IUser) => {
        setJwtCookie(res, user.userId, req.get('env'))
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
