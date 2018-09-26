import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import IUser from '../user/IUser'
import { getSafeUserById } from './userService'

const router = Router()

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - users
 *     description: Returns a user by ID
 *     summary: Returns a user by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A user
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    getSafeUserById(req.params.userId)
      .then((user: IUser) => {
        res.send(user)
      })
      .catch(err => res.status(404).send(err))
  }
)

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags:
 *       - users
 *     description: Returns the currently authorised user
 *     summary: Returns the currently authorised user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The current user
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    if (req.user) {
      res.send(getSafeUserById(req.user.userId))
    } else {
      res.status(400).send('No user')
    }
  }
)

export default router
