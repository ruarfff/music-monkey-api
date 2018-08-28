import { Request, Response, Router } from 'express'
import EventGateway from '../event/eventGateway'

const router = Router()
const eventGateway = new EventGateway()

router.get('/:eventId', (req: Request, res: Response) => {
  eventGateway
    .getEventById(req.params.eventId)
    .then(event => {
      res.send(event)
    })
    .catch(err => res.status(404).send(err))
})

router.get('/:eventId/guests', (req: Request, res: Response) => {
  eventGateway
    .getEventGuests(req.params.eventId)
    .then(guests => {
      res.send(guests)
    })
    .catch(err => res.status(404).send(err))
})

router.post('/', (req: Request, res: Response) => {
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

// TODO: Allow updates
// router.put('/events/:eventId', (req: Request, res: Response) => {})

export default router
