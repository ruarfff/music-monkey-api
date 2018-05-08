import { Request, Response } from 'express'
import EventGateway from '../event/eventGateway'

export default function(server: any) {
  const router = server.loopback.Router()
  const eventGateway = new EventGateway()

  router.get('/events', (req: Request, res: Response) => {
    eventGateway
      .getEventsByUserId(req.query.userId)
      .then(events => {
        res.send(events)
      })
      .catch(err => res.status(500).send(err))
  })

  router.get('/events/:eventId', (req: Request, res: Response) => {
    eventGateway
      .getEventById(req.params.eventId)
      .then(event => {
        res.send(event)
      })
      .catch(err => res.status(404).send(err))
  })

  router.delete('/events/:eventId', (req: Request, res: Response) => {
    const userId = req.query.userId
    eventGateway
      .deleteEvent(req.params.eventId, userId)
      .then(event => {
        res.send(event)
      })
      .catch(err => res.status(404).send(err))
  })

  router.post('/events', (req: Request, res: Response) => {
    const event = req.body
    eventGateway
      .createEvent(event)
      .then(savedEvent => {
        res.send(savedEvent)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  })

  // router.put('/events/:eventId', (req: Request, res: Response) => {})

  server.use(router)
}
