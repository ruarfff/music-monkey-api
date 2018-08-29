import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import EventDecorator from './EventDecorator'
import EventGateway from './eventGateway'
import IEvent from './IEvent'
const router = Router()
const eventGateway = new EventGateway()
const eventDecorator = new EventDecorator()

router.get(
  '/:inviteId/event',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user } = req
    try {
      if (req.params.inviteId) {
        const event: IEvent = await eventGateway.getEventByInviteId(
          req.params.inviteId
        )
        const decoratedEvent = await eventDecorator.decorateSingleEvent(
          event,
          user
        )
        res.send(decoratedEvent)
      } else {
        res.status(404).send()
      }
    } catch (err) {
      logError(err)
      res.status(404).send()
    }
  }
)

export default router
