import { Request, Response, Router } from 'express'
import { IUser } from '../model'
import UserGateway from './UserGateway'

const router = Router()
const userGateway = new UserGateway()

router.get('/:userId', (req: Request, res: Response) => {
  userGateway
    .getUserById(req.params.userId)
    .then((user: IUser) => {
      res.send(user)
    })
    .catch(err => res.status(404).send(err))
})

export default router
