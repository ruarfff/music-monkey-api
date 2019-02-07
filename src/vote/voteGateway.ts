import { logError } from '../logging'
import { Vote } from '../model'
import cleanModel from '../model/cleanModel'
import {
  handleCreateForDynamicVoting,
  handleDeleteForDynamicVoting
} from './dynamicVoting'
import IVote from './IVote'
import { onVoteCreated, onVoteDeleted } from './voteNotifier'
const { promisify } = require('util')

const create = promisify(Vote.create)
const get = promisify(Vote.get)
const remove = promisify(Vote.destroy)

export const getVoteByIdAndEventId = async (
  voteId: string,
  eventId: string
) => {
  const { attrs } = await get(voteId, eventId)
  return cleanModel(attrs)
}

export const createVote = async (vote: IVote) => {
  try {
    const voteId = `${vote.trackId}:${vote.eventId}:${vote.userId}`
    const { attrs } = await create({ ...vote, voteId } as IVote)
    const savedVote = cleanModel(attrs)
    await handleCreateForDynamicVoting(savedVote.eventId)
    onVoteCreated(savedVote)
    return savedVote
  } catch (err) {
    logError('Failed to create vote', err)
  }
}

export const deleteVote = async (voteId: string) => {
  try {
    const idParts: string[] = voteId.split(':')
    const eventId = idParts[idParts.length - 2]
    await remove(voteId, eventId)
    await handleDeleteForDynamicVoting(eventId)
    // await remove(voteId, eventId)
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
          resolve(
            votesModel.Items.map((x: any) => cleanModel(x.attrs) as IVote)
          )
        }
      })
  })
}
