import { Vote } from '../model'
import IVote from './IVote'

export const createVote = async (vote: IVote) => {
  try {
    const voteId = `${vote.trackId}:${vote.eventId}:${vote.userId}`
    const savedVote = await Vote.create({ ...vote, voteId } as IVote)
    return savedVote
  } catch (err) {
    console.error('Failed to create vote', err)
  }
}

export const deleteVote = async (voteId: string) => {
  try {
    const idParts: string[] = voteId.split(':')
    await Vote.destroy(voteId, idParts[idParts.length - 2])
  } catch (err) {
    console.error('Failed to create vote', err)
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
