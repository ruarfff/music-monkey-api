import { Response, Router } from 'express'
import * as passport from 'passport'

const router = Router()

const mockData = [
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  },
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  },
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  }
]

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async (res: Response) => {
    try {
      res.send(mockData)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
