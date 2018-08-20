import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getRsvpByUserIdAndInviteId } from './rsvpGateway'

const router = Router()

router.get(
  '/:userId/rsvp',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const inviteId = req.query.inviteId
      const userId = req.params.userId
      const savedRsvp = await getRsvpByUserIdAndInviteId(userId, inviteId)

      res.send(savedRsvp)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
