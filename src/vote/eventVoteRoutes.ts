import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import { getVotesWithStatus } from './voteService'

const router = Router()

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
