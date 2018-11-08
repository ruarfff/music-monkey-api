import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getAllEventsUserWasInvitedTo } from './userEventService'

const router = Router()

/**
 * @swagger
 * /api/v1/users/invited/events:
 *   get:
 *     tags:
 *       - events
 *     description: Get all the events the current user was invited to
 *     summary: Get all the events the current user was invited to
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Some events
 *         schema:
 *           $ref: '#/definitions/Event'
 */
router.get(
  '/invited/events',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user } = req
    try {
      const events = await getAllEventsUserWasInvitedTo(user)
      res.send(events)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

export default router
