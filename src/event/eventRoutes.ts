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
    try {
      const { user } = req
      const events: IEvent[] = await eventGateway.getEventsByUserId(user.userId)
      const decoratedEvents = await eventDecorator.decorateEvents(events, user)
      res.send(decoratedEvents)
    } catch (err) {
      logError('Error getting events', err, req)
      res.send([])
    }
  }
)

router.get(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      const event: IEvent = await eventGateway.getEventById(req.params.eventId)
      const decoratedEvent = await eventDecorator.decorateSingleEvent(
        event,
        user
      )

      res.send(decoratedEvent)
    } catch (err) {
      logError('Error getting event by IDs', err, req)
      res.status(404).send(err)
    }
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const event = req.body
    eventGateway
      .createEvent(event)
      .then(savedEvent => {
        res.send(savedEvent)
      })
      .catch(err => {
        res.status(400).send(err)
      })
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
