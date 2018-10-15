import { IRsvp } from '../model'
import { send } from '../notification'

export const onRsvpSaved = (rsvp: IRsvp, userId: string) => {
  send('mm-rsvps-' + rsvp.eventId, 'rsvp-saved', rsvp)
  send('mm-user-notifications-' + userId, 'rsvp-saved', rsvp)
}
