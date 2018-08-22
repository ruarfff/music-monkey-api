import { Vote } from '../model'
import IVote from './IVote'
import { onVoteCreated, onVoteDeleted } from './voteNotifier'

export const createVote = async (vote: IVote) => {
  try {
    const voteId = `${vote.trackId}:${vote.eventId}:${vote.userId}`
    const savedVote = await Vote.create({ ...vote, voteId } as IVote)
    onVoteCreated(vote)
    return savedVote
  } catch (err) {
    console.error('Failed to create vote', err)
  }
}

export const deleteVote = async (voteId: string) => {
  try {
    const idParts: string[] = voteId.split(':')
    const eventId = idParts[idParts.length - 2]
    await Vote.destroy(voteId, eventId)
    onVoteDeleted(eventId)
  } catch (err) {
    console.error('Failed to delete vote', err)
    throw err
  }
}

export const getVotesByEventId = (eventId: string) => {
  return new Promise<IVote[]>((resolve, reject) => {
    Vote.query(eventId)
      .usingIndex('EventIdUserIdIndex')
      .exec((err: any, votesModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(votesModel.Items.map((x: any) => x.attrs as IVote))
        }
      })
  })
}
