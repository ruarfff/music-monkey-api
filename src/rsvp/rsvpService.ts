import { IRsvp } from '../model'
import {
  fetchRsvpByEventId,
  fetchRsvpByUserId,
  fetchRsvpByUserIdAndInviteId,
  modifyRsvp,
  saveRsvp
} from './rsvpGateway'
import { onRsvpCreated, onRsvpUpdated } from './rsvpNotifier'

export const getRsvpByUserIdAndInviteId = async (
  userId: string,
  inviteId: string
) => {
  return await fetchRsvpByUserIdAndInviteId(userId, inviteId)
}

export const getRsvpByEventId = async (eventId: string) => {
  return await fetchRsvpByEventId(eventId)
}

export const getRsvpByUserId = async (userId: string) => {
  return await fetchRsvpByUserId(userId)
}

export const createRsvp = async (rsvp: IRsvp) => {
  try {
    console.log('Creating RSVP: ' + JSON.stringify(rsvp))
    const existingRsvp = await getRsvpByUserIdAndInviteId(
      rsvp.userId,
      rsvp.inviteId
    )
    if (existingRsvp) {
      return existingRsvp
    }
  } catch (err) {
    console.error(err)
  }
  const savedRsvp: IRsvp = await saveRsvp(rsvp)
  onRsvpCreated(savedRsvp)
  return savedRsvp
}

export const updateRsvp = async (rsvp: IRsvp) => {
  console.log('Updating RSVP: ' + JSON.stringify(rsvp))
  const updatedRsvp = await modifyRsvp(rsvp)
  onRsvpUpdated(updatedRsvp)
  return updatedRsvp
}
