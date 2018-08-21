import { logError } from '../logging'
import { IRsvp, Rsvp } from '../model'
const util = require('util')

export const createRsvp = async (rsvp: IRsvp) => {
  try {
    const rsvpModel = await util.promisify(Rsvp.create)(rsvp)
    return rsvpModel.attrs
  } catch (err) {
    logError('Error creating rsvp', err)
    throw err
  }
}

export const getRsvpByUserIdAndInviteId = (
  userId: string,
  inviteId: string
) => {
  return new Promise((resolve: any, reject: any) => {
    Rsvp.query(inviteId)
      .usingIndex('InviteIdUserIdIndex')
      .where('userId')
      .equals(userId)
      .exec((err: Error, rsvpModel: any) => {
        if (err || rsvpModel.Count < 1) {
          reject(err)
        } else {
          resolve(rsvpModel.Items[0].attrs)
        }
      })
  })
}

export const getRsvpByEventId = (eventId: string) => {
  return new Promise<IRsvp[]>((resolve: any, reject: any) => {
    Rsvp.query(eventId)
      .usingIndex('EventIdUserIdIndex')
      .exec((err: Error, rsvpModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(rsvpModel.Items.map((item: any) => item.attrs))
        }
      })
  })
}
