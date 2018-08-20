import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { createRsvp } from './rsvpGateway'

const router = Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const rsvp = { ...req.body, userId: req.user.userId }
      const savedRsvp = await createRsvp(rsvp)
      res.send(savedRsvp)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
