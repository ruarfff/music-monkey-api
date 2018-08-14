import { logError } from '../logging'
import { IInvite, Invite } from '../model'

export default class InviteGateway {
  public createInvite(invite: IInvite) {
    return new Promise((resolve, reject) => {
      Invite.create(invite, (err: Error, inviteModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(inviteModel)
        }
      })
    })
  }

  public deleteInvite(inviteId: string, eventId: string) {
    return new Promise((resolve, reject) => {
      Invite.destroy(inviteId, eventId, (err: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  public getInviteById(inviteId: string) {
    return new Promise((resolve, reject) => {
      Invite.query(inviteId).exec((err: Error, inviteModel: any) => {
        if (err) {
          logError('Invite Error', err)
          reject(err)
        }
        if (inviteModel.Count < 1) {
          reject(new Error('Not found'))
        } else {
          resolve(inviteModel.Items[0].attrs)
        }
      })
    })
  }

  public getInvitesByEventId(eventId: string) {
    return new Promise((resolve: any, reject: any) => {
      Invite.query(eventId)
        .usingIndex('EventIdIndex')
        .exec((err: Error, inviteModel: any) => {
          if (err || inviteModel.Items.length < 1) {
            reject(err)
          }
          const inviteList = inviteModel.Items.map((item: any) => item.attrs)
          resolve(inviteList)
        })
    })
  }
}
