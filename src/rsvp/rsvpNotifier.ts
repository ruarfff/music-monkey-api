import { IRsvp } from '../model'
import { send } from '../notification'

export const onRsvpSaved = (rsvp: IRsvp) => {
  send('mm-rsvps-' + rsvp.eventId, 'rsvp-saved', rsvp)
  send('mm-user-notifications-' + rsvp.userId, 'rsvp-saved', rsvp)
}
