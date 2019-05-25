import IUser from '../user/model/IUser'
import EventDecorator from './EventDecorator'
import IEvent from './model/IEvent'
import {
  createEvent,
  removeEvent,
  getEventById,
  getEventsByUserId,
  modifyEvent,
  getEventByInviteId
} from './eventGateway'
import * as cache from '../cache'

const cachedEventTTL = 600
const eventDecorator = new EventDecorator()

export const getEvent = async (eventId: string, user: IUser) => {
  let event: IEvent = await cache.getObject(eventId)
  if (!event) {
    event = await getEventById(eventId)
    event = await eventDecorator.decorateEvent(event, user)
    cache.setObject(event.eventId, event, cachedEventTTL)
  }

  return event
}

export const getEventByInvite = async (inviteId: string, user: IUser) => {
  const event: IEvent = await getEventByInviteId(inviteId)
  const decoratedEvent = await eventDecorator.decorateEvent(event, user)
  return decoratedEvent
}

export const getEventsForUser = async (user: IUser) => {
  const events: IEvent[] = await getEventsByUserId(user.userId)
  return eventDecorator.decorateEvents(events, user)
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
