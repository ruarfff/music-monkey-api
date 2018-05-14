import { Request, Response } from 'express'
import InviteGateway from '../event/inviteGateway'

export default function(server: any) {
  const router = server.loopback.Router()
  const inviteGateway = new InviteGateway()

  router.get('/invites', (req: Request, res: Response) => {
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

  router.get('/invites/:inviteId', (req: Request, res: Response) => {
    inviteGateway
      .getInviteById(req.params.inviteId)
      .then(invite => {
        res.send(invite)
      })
      .catch(err => res.status(404).send(err))
  })

  router.delete('/invites/:inviteId', (req: Request, res: Response) => {
    const inviteId = req.query.inviteId
    inviteGateway
      .deleteInvite(req.params.inviteId, inviteId)
      .then(invite => {
        res.send(invite)
      })
      .catch(err => res.status(404).send(err))
  })

  router.post('/invites', (req: Request, res: Response) => {
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

  server.use(router)
}
