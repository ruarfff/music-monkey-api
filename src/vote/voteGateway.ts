import { logError } from '../logging'
import { Vote } from '../model'
import {
  handleCreateForDynamicVoting,
  handleDeleteForDynamicVoting
} from './dynamicVoting'
import IVote from './IVote'
import { onVoteCreated, onVoteDeleted } from './voteNotifier'
const util = require('util')

export const getVoteByIdAndEventId = async (
  voteId: string,
  eventId: string
) => {
  const { attrs } = await util.promisify(Vote.get)(voteId, eventId)
  return attrs
}

export const createVote = async (vote: IVote) => {
  try {
    const voteId = `${vote.trackId}:${vote.eventId}:${vote.userId}`
    const savedVote = await Vote.create({ ...vote, voteId } as IVote)
    await handleCreateForDynamicVoting(vote.eventId)
    onVoteCreated(vote)
    return savedVote
  } catch (err) {
    logError('Failed to create vote', err)
  }
}

export const deleteVote = async (voteId: string) => {
  try {
    const idParts: string[] = voteId.split(':')
    const eventId = idParts[idParts.length - 2]
    await handleDeleteForDynamicVoting(eventId)
    await Vote.destroy(voteId, eventId)
    onVoteDeleted(eventId)
  } catch (err) {
    logError('Failed to delete vote', err)
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
