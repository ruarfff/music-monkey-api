import { IRsvp } from '../model'
import { getRsvpByUserId } from '../rsvp/rsvpGateway'
import IUser from '../user/model/IUser'
import { getPopulatedEventById } from './eventService'

export const getAllEventsUserWasInvitedTo = async (user: IUser) => {
  const rsvps = await getRsvpByUserId(user.userId)
  const eventIds = rsvps.map((rsvp: IRsvp) => rsvp.eventId)
  const events = await Promise.all(
    eventIds.map(async eventId => {
      return await getPopulatedEventById(user, eventId)
    })
  )
  return events
}
