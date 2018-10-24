import { Request, Response, Router } from 'express'
import * as passport from 'passport'

const router = Router()

router.post(
  '/email',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    console.log(req.body)
    console.log(res)
  }
)

export default router
