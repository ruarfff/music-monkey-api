import { Request, Response, Router } from 'express'
import InviteGateway from './inviteGateway'

const router = Router()
const inviteGateway = new InviteGateway()

router.get('/', (req: Request, res: Response) => {
  if (!req.query.eventId) {
    res.send([])
  }
  inviteGateway
    .getInvitesByEventId(req.query.eventId)
    .then(invite => {
      res.send(invite)
    })
    .catch(err => res.status(404).send(err))
})

router.get('/:inviteId', (req: Request, res: Response) => {
  inviteGateway
    .getInviteById(req.params.inviteId)
    .then(invite => {
      res.send(invite)
    })
    .catch(err => res.status(404).send(err))
})

router.delete('/:inviteId', (req: Request, res: Response) => {
  const inviteId = req.query.inviteId
  inviteGateway
    .deleteInvite(req.params.inviteId, inviteId)
    .then(invite => {
      res.send(invite)
    })
    .catch(err => res.status(404).send(err))
})

router.post('/', (req: Request, res: Response) => {
  const invite = req.body
  inviteGateway
    .createInvite(invite)
    .then(savedInvite => {
      res.send(savedInvite)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

export default router
