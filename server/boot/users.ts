import { Request, Response } from 'express'
import UserGateway from '../user/userGateway'

export default function(server: any) {
  const router = server.loopback.Router()
  const userGateway = new UserGateway()

  router.get('/users/:userId', (req: Request, res: Response) => {
    userGateway
      .getUserById(req.params.userId)
      .then(user => {
        res.send(user)
      })
      .catch(err => res.status(404).send(err))
  })

  server.use(router)
}
