import { logError } from '../logging'
import IUser from '../user/model/IUser'
import { updateEventPlaylistBasedOnVotes } from '../vote/dynamicVoting'
import EventDecorator from './EventDecorator'
import {
  createEvent,
  getEventById,
  getEventByInviteId,
  getEventsByUserId,
  modifyEvent,
  removeEvent
} from './eventGateway'
import IEvent from './model/IEvent'
const eventDecorator = new EventDecorator()

export const getEvent = async (eventId: string, user: IUser) => {
  let event = await getEventById(eventId)
  if (!event) {
    throw new Error('Could not find event with ID ' + eventId)
  }
  event = await eventDecorator.decorateEvent(event, user)
  return event
}

export const getUndecoratedEvent = async (eventId: string) => {
  const event = await getEventById(eventId)
  if (!event) {
    throw new Error('Could not find event with ID ' + eventId)
  }
  return event
}

export const getEventByInvite = async (inviteId: string, user: IUser) => {
  const event: IEvent = await getEventByInviteId(inviteId)
  const decoratedEvent = await eventDecorator.decorateEvent(event, user)
  return decoratedEvent
}

export const getEventsForUser = async (user: IUser) => {
  return await getEventsByUserId(user.userId)
}

export const saveEvent = async (event: IEvent) => {
  const savedEvent = await createEvent(event)
  return savedEvent
}

export const updateEvent = async (event: IEvent, userId: string) => {
  const existingEvent: IEvent = await getEventById(event.eventId)
  if (existingEvent.userId !== userId) {
    throw new Error('Cannot update event belonging to another user')
  }

  const updatedEvent = await modifyEvent(event)

  try {
    // Sort the playlist if dynamic voting turned on
    if (
      !existingEvent.settings.dynamicVotingEnabled &&
      event.settings.dynamicVotingEnabled
    ) {
      updateEventPlaylistBasedOnVotes(event)
    }
  } catch (err) {
    logError('Error running dynamic vote on settings update')
  }
  return updatedEvent
}

export const deleteEvent = async (eventId: string, userId: string) => {
  const existingEvent: IEvent = await getEventById(eventId)
  if (existingEvent.userId !== userId) {
    throw new Error('Cannot delete event belonging to another user')
  }
  const deletedEvent = await removeEvent(eventId, userId)
  return deletedEvent
}
