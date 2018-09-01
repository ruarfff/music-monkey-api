import { getEventById } from '../event/eventGateway'
import { logError } from '../logging'
import IVote from './IVote'
import { getVoteByIdAndEventId } from './voteGateway'

const dynamicVotingEnabled = async (vote: IVote) => {
  try {
    const event = await getEventById(vote.eventId)
    return (event.settings && event.settings.dynamicVotingEnabled) || true
  } catch (err) {
    logError('Error checking if dynamic voting is enables', err)
    return false
  }
}

export const handleCreateForDynamicVoting = async (vote: IVote) => {
  const doDV = await dynamicVotingEnabled(vote)
  console.log(doDV)
}

export const handleDeleteForDynamicVoting = async (
  voteId: string,
  eventId: string
) => {
  const vote = await getVoteByIdAndEventId(voteId, eventId)
  const doDV = await dynamicVotingEnabled(vote)
  console.log(doDV)
}
