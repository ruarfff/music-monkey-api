import { send } from '../notification'
import IEvent from './model/IEvent'

export const onEventUpdated = (event: IEvent) => {
  send('mm-events-' + event.eventId, 'event-updated', event)
}

export const onEventDeleted = (eventId: string) => {
  send('mm-events-' + eventId, 'event-deleted', {})
}
