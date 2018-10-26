import { getEventById } from '../event/eventGateway'
import { logError } from '../logging'
import { IRsvp, Rsvp } from '../model'
import cleanModel from '../model/cleanModel'
import { createNotification } from '../model/notification'
import { onRsvpSaved } from './rsvpNotifier'
const util = require('util')

export const createRsvp = async (rsvp: IRsvp) => {
  try {
    const { attrs } = await util.promisify(Rsvp.create)(rsvp)
    const event = await getEventById(attrs.eventId)
    onRsvpSaved(attrs, event.userId)
    createNotification(event, 'rsvp')
    return cleanModel(attrs)
  } catch (err) {
    logError('Error creating rsvp', err)
    throw err
  }
}

export const updateRsvp = async (rsvp: IRsvp) => {
  try {
    const existingRsvp = await getRsvpByUserIdAndInviteId(
      rsvp.userId,
      rsvp.inviteId
    )
    if (!existingRsvp) {
      throw new Error('Could not find existing rsvp to update')
    }
    const { attrs } = await util.promisify(Rsvp.update)({
      ...existingRsvp,
      rsvp
    })

    return attrs
  } catch (err) {
    logError('Error updating rsvp', err)
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
          resolve(cleanModel(rsvpModel.Items[0].attrs))
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
          resolve(rsvpModel.Items.map((item: any) => cleanModel(item.attrs)))
        }
      })
  })
}

export const getRsvpByUserId = (userId: string) => {
  return new Promise<IRsvp[]>((resolve: any, reject: any) => {
    Rsvp.query(userId)
      .usingIndex('UserIdIndex')
      .exec((err: Error, rsvpModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(rsvpModel.Items.map((item: any) => cleanModel(item.attrs)))
        }
      })
  })
}
