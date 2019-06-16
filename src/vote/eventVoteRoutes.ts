import { Request, Response, Router } from 'express'
import passport from 'passport'
import { logError } from '../logging'
import { getVotesWithStatus } from './voteService'

const router = Router()

/**
 * @swagger
 * /events/{eventId}/votes:
 *   get:
 *     tags:
 *       - votes
 *     description: Get votes for an event
 *     summary: Get votes for an event
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Event ID for filter on
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All votes for an event
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Vote'
 */
router.get(
  '/:eventId/votes',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.user
      const { eventId } = req.params
      const votesWithStatus = await getVotesWithStatus(eventId, userId)
      res.send(votesWithStatus)
    } catch (err) {
      logError('Error getting votes by event id', err, req)
      res.status(404).send(err)
    }
  }
)

export default router
