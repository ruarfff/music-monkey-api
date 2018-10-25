import { Request, Response, Router } from 'express'
import * as passport from 'passport'

const router = Router()

router.post(
  '/email',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { emails } = req.body
    try {
      console.log(emails)
      res.status(200).send('Emails successfully sended')
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

export default router
