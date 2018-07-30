import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import EventDecorator from '../event/EventDecorator'
import EventGateway from '../event/eventGateway'
import { IEvent } from '../model'
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
            .decorateSingleEvent(event, user.user)
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
        eventDecorator.decorateSingleEvent(event, user.user).then(res.send)
      })
      .catch(err => res.status(404).send(err))
  }
)

export default router
