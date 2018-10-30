import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import {
  getNotificationByIdAndUserId,
  getUsersNotifications,
  updateNotification
} from './notificationService'

const router = Router()

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      if (req.user.userId !== userId) {
        res
          .status(401)
          .send(
            'You do not have permission to view another users notifications'
          )
        return
      }
      const userNotifications = await getUsersNotifications(req.params.userId)
      res.send(userNotifications)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

router.put(
  '/:notificationId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    let errorStatus = 500
    try {
      const notification = req.body
      const { userId } = req.user
      const { notificationId } = req.params
      if (notification.userId !== userId) {
        errorStatus = 401
        throw new Error('You cannot modify another users notification')
      }

      if (notification.notificationId !== notificationId) {
        errorStatus = 400
        throw new Error(
          'Notification id param does not match notification body'
        )
      }

      const existingNotification = await getNotificationByIdAndUserId(
        notificationId,
        userId
      )
      if (!existingNotification) {
        errorStatus = 404
        throw new Error(
          'Could not find notification with ID: ' + notificationId
        )
      }

      const updatedNotification = updateNotification({
        ...existingNotification,
        ...notification
      })

      res.send(updatedNotification)
    } catch (e) {
      res.status(errorStatus).send(e.message)
    }
  }
)

export default router
