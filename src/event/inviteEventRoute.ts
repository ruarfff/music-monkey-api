import { Request, Response, Router } from 'express'
import passport from 'passport'
import { logError } from '../logging'
import { getEventByInvite } from './eventService'
import IEvent from './model/IEvent'
const router = Router()

/**
 * @swagger
 * /api/v1/invites/{inviteId}/event:
 *   get:
 *     tags:
 *       - events
 *     description: Get an event by invite ID
 *     summary: Get an event by invite ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An event
 *         schema:
 *           $ref: '#/definitions/Event'
 */
router.get(
  '/:inviteId/event',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user, params } = req
    const { inviteId } = params
    try {
      const event: IEvent = await getEventByInvite(inviteId, user)
      res.send(event)
    } catch (err) {
      logError('Could not get event by invite', err, req)
      res.status(404).send(err.message)
    }
  }
)

export default router
