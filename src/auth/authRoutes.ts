import * as bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import { isEmpty } from 'lodash'
import * as passport from 'passport'
import { IS_PRODUCTION } from '../config'
import { logError } from '../logging'
import { refreshToken } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import { checkUserProfile } from '../user/profileCheck'
import { createNewUser } from '../user/userService'
import { setJwtCookie } from './authRequestLib'
import forgotPassword from './forgotPassword'

const devCookieOpts = {}
const prodCookieOpts = { httpOnly: true, secure: true }

const router = Router()

/**
 * @swagger
 * /refresh:
 *   post:
 *     tags:
 *       - auth
 *     summary: Signs up a new user
 *     description: Creates a new user with the given details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully created
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Auth'
 *       description: Authentication details
 */
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

/**
 * @swagger
 * /verify:
 *   get:
 *     tags:
 *       - auth
 *     description: Verifies the user is logged in
 *     summary: Verifies the user is logged in and returns the logged in user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A user
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user } = req
    const checkedUser = await checkUserProfile(user)
    res.status(200).send(checkedUser)
  }
)

/**
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *       - auth
 *     description: Logs the user out
 *     summary: Logs the user out by removing cookies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logged out
 */
router.get('/logout', (_req: Request, res: Response) => {
  if (IS_PRODUCTION) {
    res.clearCookie('jwt', prodCookieOpts)
  } else {
    res.clearCookie('jwt', devCookieOpts)
  }
  res.status(200).send()
})

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Log a user in with email and password
 *     description: Standard login method
 *     responses:
 *       200:
 *         description: Successfully logged in
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Auth'
 *       description:  Authentication details
 *
 */
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

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - auth
 *     summary: Signs up a new user
 *     description: Creates a new user with the given details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully created
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Auth'
 *       description: Authentication details
 */
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

/**
 * @swagger
 * /forgot:
 *   post:
 *     tags:
 *       - auth
 *     summary: For when a user forgot their password
 *     description: For when a user forgot their password
 *     responses:
 *       200:
 *         description: Success
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Auth'
 *       description:  Authentication details
 *
 */
router.post('/forgot', (req: Request, res: Response) => {
  try {
    const { email } = req.body
    forgotPassword(email)
    res.status(200).send()
  } catch (err) {
    const message = 'An unexpected error occurred. Please try again. '
    logError(message, err, req)
    res.status(500).send(message)
  }
})

export default router
