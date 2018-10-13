import { IInvite } from '../invite'
import { send } from '../notification'

export const onInviteCreated = (invite: IInvite) => {
  send('mm-invites-' + invite.eventId, 'invite-created', invite)
}

export const onInviteDeleted = (inviteId: string, eventId: string) => {
  send('mm-invites-' + eventId, 'invite-deleted', { inviteId })
}
