import { promisify } from 'util'
import { IInvite, Invite } from '../model'
import cleanModel from '../model/cleanModel'

export default class InviteGateway {
  public createInvite(invite: IInvite) {
    return new Promise((resolve, reject) => {
      Invite.create(invite, (err: Error, inviteModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(cleanModel(inviteModel))
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

  public async getInviteById(inviteId: string) {
    const { attrs } = await promisify(Invite.get)(inviteId)
    const invite = cleanModel(attrs)
    return invite
  }

  public getInvitesByEventId(eventId: string) {
    return new Promise<IInvite[]>((resolve: any, reject: any) => {
      Invite.query(eventId)
        .usingIndex('EventIdIndex')
        .exec((err: Error, inviteModel: any) => {
          if (err || inviteModel.Items.length < 1) {
            reject(err)
          } else {
            const inviteList = inviteModel.Items.map((item: any) =>
              cleanModel(item.attrs)
            )
            resolve(inviteList)
          }
        })
    })
  }
}
