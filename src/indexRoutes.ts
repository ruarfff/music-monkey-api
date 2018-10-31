import { Request, Response, Router } from 'express'

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       displayName:
 *         type: string
 *       image:
 *         type: string
 *       userId:
 *         type: string
 *       isGuest:
 *         type: boolean
 *  @swagger
 * definition:
 *   Auth:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *  @swagger
 * definition:
 *  Event:
 *     properties:
 *       eventId:
 *         type: string
 *       userId:
 *         type: string
 *       organizer:
 *         type: string
 *       imageUrl:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       venue:
 *         type: string
 *       location:
 *         type: object
 *       startDateTime:
 *         type: string
 *       endDateTime:
 *         type: string
 *       eventCode:
 *         type: string
 *       playlist:
 *         type: object
 *       playlistUrl:
 *         type: string
 *       invites:
 *         type: array
 *       guests:
 *         type: array
 *       settings:
 *         type: object
 *  @swagger
 *  definition:
 *   Notification:
 *     properties:
 *       notificationId:
 *         type: string
 *       userId:
 *         type: string
 */
const router = Router()

router.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

export default router
