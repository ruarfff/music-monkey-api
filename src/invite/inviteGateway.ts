import { promisify } from 'util'
import { Invite } from '../model'
import cleanModel from '../model/cleanModel'
import { IInvite } from './model/IInvite'

const create = promisify(Invite.create)
const destroy = promisify(Invite.destroy)
const get = promisify(Invite.get)

export const createInvite = async (invite: IInvite) => {
  const savedInvite = await create(invite)
  return cleanModel(savedInvite)
}

export const deleteInvite = async (inviteId: string, eventId: string) => {
  return await destroy(inviteId, eventId)
}

export const getInviteById = async (inviteId: string) => {
  const { attrs } = await get(inviteId)
  const invite = cleanModel(attrs)
  return invite
}

export const getInvitesByEventId = (eventId: string) => {
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
