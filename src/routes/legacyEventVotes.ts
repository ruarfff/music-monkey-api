import { Request, Response, Router } from 'express'
import { logError } from '../logging'
import IVote from '../vote/IVote'
import { getVotesByEventId } from '../vote/voteGateway'

const router = Router()

router.get('/:eventId/votes', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params
    const votes: IVote[] = await getVotesByEventId(eventId)
    const votesWithStatus = {} as any
    votes.forEach((vote: IVote) => {
      const votedByCurrentUser = false
      let numberOfVotes = 1
      const voteStatus = votesWithStatus[vote.trackId]
      if (voteStatus) {
        numberOfVotes += voteStatus.numberOfVotes
      }
      votesWithStatus[vote.trackId] = { numberOfVotes, votedByCurrentUser }
    })
    res.send(votesWithStatus)
  } catch (err) {
    logError('Error getting votes by event id', err)
    res.status(404).send(err)
  }
})

export default router
