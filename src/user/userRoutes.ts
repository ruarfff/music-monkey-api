import { Request, Response, Router } from 'express'
import IUser from '../user/IUser'
import { getUserById } from './userService'

const router = Router()

router.get('/:userId', (req: Request, res: Response) => {
  getUserById(req.params.userId)
    .then((user: IUser) => {
      res.send(user)
    })
    .catch(err => res.status(404).send(err))
})

export default router
