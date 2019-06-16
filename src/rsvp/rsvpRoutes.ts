import { Request, Response, Router } from 'express'
import passport from 'passport'
import { logDebug } from '../logging'
import {
  createRsvp,
  getRsvpByUserIdAndInviteId,
  updateRsvp
} from './rsvpService'

const router = Router()

/**
 * @swagger
 * /rsvp:
 *   post:
 *     tags:
 *       - rsvp
 *     description: Create a new RSVP
 *     summary: Create a new RSVP
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/RSVP'
 *     responses:
 *       200:
 *         description: An RSVP
 *         schema:
 *           $ref: '#/definitions/RSVP'
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId
      const { inviteId } = req.body
      const rsvp = { ...req.body, userId }
      let responseRsvp
      try {
        responseRsvp = await getRsvpByUserIdAndInviteId(userId, inviteId)
      } catch (ignore) {
        logDebug(ignore)
      }
      if (!responseRsvp) {
        responseRsvp = await createRsvp(rsvp, req.user)
      }
      res.send(responseRsvp)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

/**
 * @swagger
 * /rsvp/{rsvpId}:
 *   put:
 *     tags:
 *       - rsvp
 *     description: Update an RSVP
 *     summary: Update an RSVP
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/RSVP'
 *     responses:
 *       200:
 *         description: Updated RSVP
 *         schema:
 *           $ref: '#/definitions/RSVP'
 */
router.put(
  '/:rsvpId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const rsvp = { ...req.body, userId: req.user.userId }
      const savedRsvp = await updateRsvp(rsvp, req.user)
      res.send(savedRsvp)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
