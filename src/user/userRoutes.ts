import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import IUser from '../user/IUser'
import { getSafeUserById } from './userService'

/**
 * @swagger
 * definition:
 *   users:
 *     properties:
 *       displayName:
 *         type: string
 *       image:
 *         type: string
 *       userId:
 *         type: string
 *       isGuest:
 *         type: boolean
 */

const router = Router()

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   security:
 *    - cookieAuth: []
 *   get:
 *     tags:
 *       - users
 *     description: Returns a user by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A user
 *         schema:
 *           $ref: '#/definitions/users'
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
 * /api/v1/users/me:
 *   security:
 *     - cookieAuth: []
 *   get:
 *     tags:
 *       - users
 *     description: Returns the currently authorised user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The current user
 *         schema:
 *           $ref: '#/definitions/users'
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
