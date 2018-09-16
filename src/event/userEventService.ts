import { IRsvp } from '../model'
import { getRsvpByUserId } from '../rsvp/rsvpGateway'
import { getEventById } from './eventGateway'

export const getAllEventsUserWasInvitedTo = async (userId: string) => {
  const rsvps = await getRsvpByUserId(userId)
  const eventIds = rsvps.map((rsvp: IRsvp) => rsvp.eventId)
  const events = await Promise.all(
    eventIds.map(async eventId => {
      return await getEventById(eventId)
    })
  )
  return events
}
