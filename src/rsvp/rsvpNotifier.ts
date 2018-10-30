import { IRsvp } from '../model'
import { send } from '../notification'

export const onRsvpCreated = (rsvp: IRsvp) => {
  send('mm-rsvps-' + rsvp.eventId, 'rsvp-saved', rsvp)
}

export const onRsvpUpdated = (rsvp: IRsvp) => {
  send('mm-rsvps-' + rsvp.eventId, 'rsvp-updated', rsvp)
}
