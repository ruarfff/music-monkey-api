import { getEventById } from '../event/eventGateway'
import IEvent from '../event/model/IEvent'
import { logError } from '../logging'
import { IRsvp } from '../model'
import { createNotification } from '../notification'
import INotification from '../notification/INotification'
import IUser from '../user/model/IUser'
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

export const createRsvp = async (rsvp: IRsvp, user: IUser) => {
  const savedRsvp: IRsvp = await saveRsvp(rsvp)
  if (rsvp.status !== 'Pending') {
    notifyRsvpCreation(savedRsvp, user)
  }
  return savedRsvp
}

async function notifyRsvpCreation(rsvp: IRsvp, user: IUser) {
  try {
    const event: IEvent = await getEventById(rsvp.eventId)
    onRsvpCreated(rsvp)
    await createNotification({
      userId: event.userId,
      context: 'event',
      type: 'rsvp',
      contextId: event.eventId,
      content: `${user.displayName ||
        user.email} had opened their invite for the event: ${event.name}`
    } as INotification)
  } catch (err) {
    logError('Could not send rsvp notification', err)
  }
}

export const updateRsvp = async (rsvp: IRsvp, user: IUser) => {
  const updatedRsvp = await modifyRsvp(rsvp)
  notifyRsvpUpdated(updatedRsvp, user)
  return updatedRsvp
}

async function notifyRsvpUpdated(rsvp: IRsvp, user: IUser) {
  try {
    const event: IEvent = await getEventById(rsvp.eventId)
    onRsvpUpdated(rsvp)
    await createNotification({
      userId: event.userId,
      context: 'event',
      type: 'rsvp',
      contextId: event.eventId,
      content: `${user.displayName || user.email} responded with ${
        rsvp.status
      } to the event: ${event.name}`
    } as INotification)
  } catch (err) {
    logError('Could not send rsvp notification', err)
  }
}
