import { uniqWith } from 'lodash'
import util = require('util')
import { logError } from '../logging'
import { IRsvp, Rsvp } from '../model'
import cleanModel from '../model/cleanModel'

export const saveRsvp = async (rsvp: IRsvp) => {
  try {
    const { attrs } = await util.promisify(Rsvp.create)(rsvp)
    return cleanModel(attrs)
  } catch (err) {
    logError('Error creating rsvp', err)
    throw err
  }
}

export const modifyRsvp = async (rsvp: IRsvp) => {
  try {
    const existingRsvp: IRsvp = await fetchRsvpByUserIdAndInviteId(
      rsvp.userId,
      rsvp.inviteId
    )
    if (!existingRsvp) {
      throw new Error('Could not find existing rsvp to update')
    }
    const { attrs } = await util.promisify(Rsvp.update)({
      ...existingRsvp,
      status: rsvp.status
    })

    return attrs
  } catch (err) {
    logError('Error updating rsvp', err)
    throw err
  }
}

export const fetchRsvpByUserIdAndInviteId = (
  userId: string,
  inviteId: string
) => {
  return new Promise<IRsvp>((resolve: any, reject: any) => {
    Rsvp.query(inviteId)
      .usingIndex('InviteIdUserIdIndex')
      .where('userId')
      .equals(userId)
      .exec((err: Error, rsvpModel: any) => {
        if (err) {
          reject(err)
        } else if (rsvpModel.Count < 1) {
          reject({ message: 'Not found', code: 404 })
        } else {
          resolve(cleanModel(rsvpModel.Items[0].attrs))
        }
      })
  })
}

export const fetchRsvpByEventId = (eventId: string) => {
  return new Promise<IRsvp[]>((resolve: any, reject: any) => {
    Rsvp.query(eventId)
      .usingIndex('EventIdUserIdIndex')
      .exec((err: Error, rsvpModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(
            uniqWith(
              rsvpModel.Items.map((item: any) =>
                cleanModel(item.attrs as IRsvp)
              ),
              (a: IRsvp, b: IRsvp) => {
                return a.userId === b.userId && a.inviteId === b.inviteId
              }
            )
          )
        }
      })
  })
}

export const fetchRsvpByUserId = (userId: string) => {
  return new Promise<IRsvp[]>((resolve: any, reject: any) => {
    Rsvp.query(userId)
      .usingIndex('UserIdIndex')
      .exec((err: Error, rsvpModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(
            uniqWith(
              rsvpModel.Items.map((item: any) =>
                cleanModel(item.attrs as IRsvp)
              ),
              (a: IRsvp, b: IRsvp) => {
                return a.userId === b.userId && a.inviteId === b.inviteId
              }
            )
          )
        }
      })
  })
}
