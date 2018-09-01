import { send } from '../notification'
import IVote from './IVote'

export const onVoteCreated = async (vote: IVote) => {
  send('mm-votes-' + vote.eventId, 'vote-saved', vote)
}

export const onVoteDeleted = async (eventId: string) => {
  send('mm-votes-' + eventId, 'vote-deleted', {})
}
