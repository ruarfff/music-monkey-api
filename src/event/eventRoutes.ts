import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { IEvent } from '../model'
import EventDecorator from './EventDecorator'
import EventGateway from './eventGateway'
const router = Router()
const eventGateway = new EventGateway()
const eventDecorator = new EventDecorator()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    let action = null
    if (req.query.inviteId) {
      action = eventGateway.getEventByInviteId(req.query.inviteId)
    }
    if (action) {
      action
        .then((event: IEvent) => {
          eventDecorator
            .decorateSingleEvent(event, user)
            .then(decoratedEvent => {
              res.send(decoratedEvent)
            })
        })
        .catch(err => res.status(500).send(err))
    } else {
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

export default router
