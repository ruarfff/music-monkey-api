import { Request, Response, Router } from 'express'
import passport from 'passport'
import { getRsvpByUserId, getRsvpByUserIdAndInviteId } from './rsvpService'

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
      let savedRsvp
      if (inviteId) {
        savedRsvp = await getRsvpByUserIdAndInviteId(userId, inviteId)
      } else {
        savedRsvp = await getRsvpByUserId(userId)
      }

      res.send(savedRsvp)
    } catch (err) {
      res
        .status(err.code || 400)
        .send(err ? err.message : 'An unexpected error occurred.')
    }
  }
)

export default router
