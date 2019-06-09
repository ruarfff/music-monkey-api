import { IRsvp } from '../model'
import { getRsvpByUserId } from '../rsvp/rsvpService'
import IUser from '../user/model/IUser'
import { getEvent } from './eventService'

export const getAllEventsUserWasInvitedTo = async (user: IUser) => {
  const rsvps = await getRsvpByUserId(user.userId)
  const eventIds = rsvps.map((rsvp: IRsvp) => rsvp.eventId)
  const events = await Promise.all(
    eventIds.map(async eventId => {
      let event = null
      try {
        event = await getEvent(eventId, user)
      } catch (err) {
        console.log('Failed to get event', err)
      }
      return event
    })
  )
  return events.filter(elem => elem !== null)
}
