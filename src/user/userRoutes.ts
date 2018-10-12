import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import IUser from '../user/IUser'
import { getSafeUserById, updateUser } from './userService'

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

router.put(
  '/:userId',
  passport.authenticate('jwt', {  session: false}),
  async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId
      const payload = req.body
      const user = await getSafeUserById(userId)

      if (userId !== user.userId) {
        res.status(400).send('Cannot update user details belonging to another user')
      } else if (payload.userId !== user.userId) {
        res.status(400).send('Cannot update user ID')
      } else {
        const updatedUser = await updateUser(payload)
        res.send(updatedUser)
      }
    } catch (err) {
      res.status(404).send(err)
    }
  }
)

export default router
