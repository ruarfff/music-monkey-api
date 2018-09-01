import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import IVote from './IVote'
import { getVotesByEventId } from './voteGateway'

const router = Router()

router.get(
  '/:eventId/votes',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.user
      const { eventId } = req.params
      const votes: IVote[] = await getVotesByEventId(eventId)
      const votesWithStatus = {} as any
      votes.forEach((vote: IVote) => {
        let votedByCurrentUser = vote.userId === userId
        let numberOfVotes = 1
        const voteStatus = votesWithStatus[vote.trackId]
        if (voteStatus) {
          numberOfVotes += voteStatus.numberOfVotes
          votedByCurrentUser =
            voteStatus.votedByCurrentUser || votedByCurrentUser
        }
        votesWithStatus[vote.trackId] = { numberOfVotes, votedByCurrentUser }
      })
      res.send(votesWithStatus)
    } catch (err) {
      logError('Error getting votes by event id', err, req)
      res.status(404).send(err)
    }
  }
)

export default router
