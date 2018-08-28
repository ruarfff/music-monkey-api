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
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user } = req
    try {
      if (req.query.inviteId) {
        const event: IEvent = await eventGateway.getEventByInviteId(
          req.query.inviteId
        )
        const decoratedEvent = await eventDecorator.decorateSingleEvent(
          event,
          user
        )
        res.send(decoratedEvent)
      } else {
        const events: IEvent[] = await eventGateway.getEventsByUserId(
          user.userId
        )
        const decoratedEvents = await eventDecorator.decorateEvents(
          events,
          user
        )
        res.send(decoratedEvents)
      }
    } catch (err) {
      logError(err)
      res.send([])
    }
  }
)

router.get(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    eventGateway
      .getEventById(req.params.eventId)
      .then((event: IEvent) => {
        const { user } = req
        eventDecorator.decorateSingleEvent(event, user).then(res.send)
      })
      .catch(err => res.status(404).send(err))
  }
)

router.delete(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const userId = req.user.userId
    eventGateway
      .deleteEvent(req.params.eventId, userId)
      .then(event => {
        res.send(event)
      })
      .catch(err => res.status(404).send(err))
  }
)

export default router
