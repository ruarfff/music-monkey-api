import IUser from '../user/IUser'
import EventDecorator from './EventDecorator'
import { getEventById } from './eventGateway'
import IEvent from './IEvent'

const eventDecorator = new EventDecorator()

export const getPopulatedEventById = async (user: IUser, eventId: string) => {
  const event: IEvent = await getEventById(eventId)
  const decoratedEvent = await eventDecorator.decorateEvent(event, user)
  return decoratedEvent
}
