import { IRsvp } from '../model'
import { getRsvpByUserId } from '../rsvp/rsvpService'
import IUser from '../user/model/IUser'
import { getUndecoratedEvent } from './eventService'

export const getAllEventsUserWasInvitedTo = async (user: IUser) => {
  const rsvps = await getRsvpByUserId(user.userId)
  const eventIds = rsvps.map((rsvp: IRsvp) => rsvp.eventId)
  const events = await Promise.all(
    eventIds.map(async (eventId) => {
      let event = null
      try {
        event = await getUndecoratedEvent(eventId)
      } catch (err) {
        console.error('Failed to get event', err)
      }
      return event
    })
  )
  return events.filter((elem) => elem !== null)
}
