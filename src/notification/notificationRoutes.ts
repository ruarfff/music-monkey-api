import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getNotificationByUserId } from './notificationService'

const router = Router()

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    try {
      const userNotifications = getNotificationByUserId(req.params.userId)
      res.send(userNotifications)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

export default router
