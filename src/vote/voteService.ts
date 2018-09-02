import IVote from './IVote'
import { getVotesByEventId } from './voteGateway'

export const getVotesWithStatus = async (eventId: string, userId: string) => {
  const votes: IVote[] = await getVotesByEventId(eventId)
  const votesWithStatus = {} as any
  votes.forEach((vote: IVote) => {
    let votedByCurrentUser = vote.userId === userId
    let numberOfVotes = 1
    const voteStatus = votesWithStatus[vote.trackId]
    if (voteStatus) {
      numberOfVotes += voteStatus.numberOfVotes
      votedByCurrentUser = voteStatus.votedByCurrentUser || votedByCurrentUser
    }
    votesWithStatus[vote.trackId] = { numberOfVotes, votedByCurrentUser }
  })
  return votesWithStatus
}
