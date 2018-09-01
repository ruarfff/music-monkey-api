import IVote from './IVote'
import { getVoteByIdAndEventId } from './voteGateway'

export const handleCreateForDynamicVoting = async (vote: IVote) => {
  console.log(vote)
}

export const handleDeleteForDynamicVoting = async (
  voteId: string,
  eventId: string
) => {
  const vote = await getVoteByIdAndEventId(voteId, eventId)
  console.log(vote)
}
