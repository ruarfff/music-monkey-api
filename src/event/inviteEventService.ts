import { IRsvp } from '../model'
import { getRsvpByUserId } from '../rsvp/rsvpGateway'
export const getAllEventsUserWasInvitedTo = async (userId: string) => {
  const rsvps = await getRsvpByUserId(userId)
  const eventIds = rsvps.map((rsvp: IRsvp) => rsvp.eventId)

  return eventIds
}
