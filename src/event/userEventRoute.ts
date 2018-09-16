import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getAllEventsUserWasInvitedTo } from './userEventService'

const router = Router()

router.get(
  '/invited/events',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { user } = req
    const events = await getAllEventsUserWasInvitedTo(user.userId)
    res.send(events)
  }
)

export default router
