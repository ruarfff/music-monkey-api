import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getRsvpByUserIdAndInviteId } from './rsvpGateway'

const router = Router()

/**
 * @swagger
 * /users/{userId}/rsvp:
 *   get:
 *     tags:
 *       - rsvp
 *     description: Get a users RSVPs
 *     summary: Get a users RSVPs (responses to invites)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An rsvp
 *         schema:
 *           $ref: '#/definitions/RSVP'
 */
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
