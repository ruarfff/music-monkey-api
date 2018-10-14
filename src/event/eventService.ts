import IUser from '../user/model/IUser'
import EventDecorator from './EventDecorator'
import { getEventById } from './eventGateway'
import IEvent from './model/IEvent'

const eventDecorator = new EventDecorator()

export const getPopulatedEventById = async (user: IUser, eventId: string) => {
  const event: IEvent = await getEventById(eventId)
  const decoratedEvent = await eventDecorator.decorateEvent(event, user)
  return decoratedEvent
}
