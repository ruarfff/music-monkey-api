import { Request, Response, Router } from 'express'
import * as passport from 'passport'

const router = Router()

const mockData = [
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId1',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  },
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId2',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  },
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId3',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  }
]

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    console.log(req)
    res.send(mockData)
  }
)

export default router
