import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { createRsvp } from './rsvpGateway'

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
      const rsvp = { ...req.body, userId: req.user.userId }
      const savedRsvp = await createRsvp(rsvp)
      res.send(savedRsvp)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
