import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import EventDecorator from './EventDecorator'
import { getEventByInviteId } from './eventGateway'
import IEvent from './IEvent'
const router = Router()
const eventDecorator = new EventDecorator()

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
    const { user } = req
    try {
      if (req.params.inviteId) {
        const event: IEvent = await getEventByInviteId(req.params.inviteId)
        const decoratedEvent = await eventDecorator.decorateSingleEvent(
          event,
          user
        )
        res.send(decoratedEvent)
      } else {
        res.status(404).send()
      }
    } catch (err) {
      logError('Error getting event by invite id', err, req)
      res.status(404).send()
    }
  }
)

export default router
