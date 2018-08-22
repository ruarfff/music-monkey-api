import { send } from '../notification'
import IVote from './IVote'

export const onVoteCreated = (vote: IVote) => {
  send('mm-votes-' + vote.eventId, 'vote-saved', vote)
}

export const onVoteDeleted = (eventId: string) => {
  send('mm-votes-' + eventId, 'vote-deleted', {})
}
