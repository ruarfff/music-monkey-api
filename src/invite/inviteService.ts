import { IInvite } from '../invite'
import * as inviteGateway from './inviteGateway'
import { onInviteCreated, onInviteDeleted } from './inviteNotifier'

export const createInvite = async (invite: IInvite) => {
  const savedInvite = await inviteGateway.createInvite(invite)
  onInviteCreated(savedInvite)
  return savedInvite
}

export const deleteInvite = async (inviteId: string, eventId: string) => {
  const result = await inviteGateway.deleteInvite(inviteId, eventId)
  onInviteDeleted(inviteId, eventId)
  return result
}

export const getInviteById = async (inviteId: string) => {
  const invite = await inviteGateway.getInviteById(inviteId)
  return invite
}

export const getInvitesByEventId = async (eventId: string) => {
  const invites = await inviteGateway.getInvitesByEventId(eventId)
  return invites
}
