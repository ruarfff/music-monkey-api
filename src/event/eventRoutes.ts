import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import EventDecorator from './EventDecorator'
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventsByUserId,
  updateEvent
} from './eventGateway'
import IEvent from './IEvent'
const router = Router()
const eventDecorator = new EventDecorator()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      const events: IEvent[] = await getEventsByUserId(user.userId)
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
      const event: IEvent = await getEventById(req.params.eventId)
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

    createEvent(event)
      .then(savedEvent => {
        res.send(savedEvent)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
)

router.put(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId
      const event = await getEventById(req.params.eventId)
      if (userId !== event.userId) {
        res.status(400).send('Cannot update event')
      } else {
        const updatedEvent = await updateEvent(event)
        res.send(updatedEvent)
      }
    } catch (err) {
      res.status(404).send(err)
    }
  }
)

router.delete(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const userId = req.user.userId

    deleteEvent(req.params.eventId, userId)
      .then(event => {
        res.send(event)
      })
      .catch(err => res.status(404).send(err))
  }
)

export default router
