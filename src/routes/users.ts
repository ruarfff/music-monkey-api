import { Request, Response, Router } from 'express'
import UserGateway from '../user/userGateway'

const router = Router()
const userGateway = new UserGateway()

router.get('/:userId', (req: Request, res: Response) => {
  userGateway
    .getUserById(req.params.userId)
    .then(user => {
      res.send(user)
    })
    .catch(err => res.status(404).send(err))
})

export default router
