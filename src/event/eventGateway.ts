import { promisify } from 'util'
import { IInvite } from '../invite'
import {
  createInvite,
  getInviteById,
  getInvitesByEventId
} from '../invite/inviteGateway'
import { logError } from '../logging'
import { IRsvp } from '../model'
import cleanModel from '../model/cleanModel'
import { Event } from '../model/event'
import { getRsvpByEventId } from '../rsvp/rsvpService'
import { getSafeUserById } from '../user/userService'
import { onEventDeleted, onEventUpdated } from './eventNotifier'
import IEvent from './model/IEvent'
import IEventGuest from './model/IEventGuest'

export const getEventGuests = async (
  eventId: string
): Promise<IEventGuest[]> => {
  try {
    const rsvps: IRsvp[] = await getRsvpByEventId(eventId)
    const eventGuests = rsvps.map(async (rsvp: IRsvp) => {
      const user = await getSafeUserById(rsvp.userId)
      return { user, rsvp } as IEventGuest
    })
    return await Promise.all(eventGuests)
  } catch (err) {
    logError('Failed to get event guests', err)
    return []
  }
}

export const createEvent = (event: IEvent) => {
  return new Promise((resolve, reject) => {
    Event.create(event, (err: Error, eventModel: any) => {
      if (err) {
        reject(err)
      } else {
        createInvite({
          eventId: eventModel.get('eventId')
        } as IInvite)
          .then((inviteModel: any) => {
            resolve({
              ...cleanModel(eventModel.attrs),
              invites: [inviteModel.attrs.inviteId]
            })
          })
          .catch(inviteCreateErr => {
            logError('Error creating invite', inviteCreateErr)
            resolve(cleanModel(eventModel.attrs))
          })
      }
    })
  })
}

export const modifyEvent = (event: IEvent) => {
  return new Promise((resolve, reject) => {
    Event.update(event, (err: Error, { attrs }: any) => {
      if (err) {
        return reject(err)
      }
      const updatedEvent = cleanModel(attrs)
      onEventUpdated(updatedEvent)
      return resolve(updatedEvent)
    })
  })
}

export const removeEvent = (eventId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    Event.destroy(eventId, userId, (err: Error) => {
      if (err) {
        return reject(err)
      }
      onEventDeleted(eventId)
      return resolve()
    })
  })
}

export const getEventsByMultipleIds = async (eventIds: string[]) => {
  const events = await promisify(Event.getItems)(eventIds)

  return events
}

export const getEventById = async (eventId: string) => {
  const { attrs } = await promisify(Event.get)(eventId)
  const event = attrs
  const invites: IInvite[] = await getInvitesByEventId(event.eventId)
  return cleanModel({
    ...event,
    invites: invites.map((invite: any) => invite.inviteId)
  })
}

export const getEventByInviteId = async (inviteId: string) => {
  const { eventId }: IInvite = await getInviteById(inviteId)

  return getEventById(eventId)
}

export const getEventsByUserId = (userId: string) => {
  return new Promise<IEvent[]>((resolve: any, reject: any) => {
    Event.query(userId)
      .usingIndex('UserIdIndex')
      .exec((err: Error, eventModel: any) => {
        if (err) {
          reject(err)
        } else if (eventModel.Items.length < 1) {
          resolve([])
        } else {
          const eventList = eventModel.Items.map((item: any) =>
            cleanModel(item.attrs)
          )
          resolve(eventList)
        }
      })
  })
}
