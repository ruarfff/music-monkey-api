import InviteGateway from '../invite/inviteGateway'
import { logError } from '../logging'
import { Event, IEvent, IInvite, IRsvp } from '../model'
import { getRsvpByEventId } from '../rsvp/rsvpGateway'
import UserGateway from '../user/UserGateway'
import IEventGuest from './IEventGuest'

const inviteGateway: InviteGateway = new InviteGateway()
const userGateway: UserGateway = new UserGateway()

export default class EventGateway {
  public async getEventGuests(eventId: string): Promise<IEventGuest[]> {
    try {
      const rsvps: IRsvp[] = await getRsvpByEventId(eventId)
      const eventGuests = rsvps.map(async (rsvp: IRsvp) => {
        const user = await userGateway.getSafeUserById(rsvp.userId)
        return { user, rsvp } as IEventGuest
      })
      return await Promise.all(eventGuests)
    } catch (err) {
      logError('Failed to get event guests', err)
      return []
    }
  }
  public createEvent(event: IEvent) {
    return new Promise((resolve, reject) => {
      Event.create(event, (err: Error, eventModel: any) => {
        if (err) {
          reject(err)
        } else {
          inviteGateway
            .createInvite({
              eventId: eventModel.get('eventId')
            } as IInvite)
            .then((inviteModel: any) => {
              resolve({
                ...eventModel.attrs,
                invites: [inviteModel.attrs.inviteId]
              })
            })
            .catch(inviteCreateErr => {
              logError('Error creating invite', inviteCreateErr)
              resolve(eventModel.attrs)
            })
        }
      })
    })
  }

  public updateEvent(event: IEvent) {
    return new Promise((resolve, reject) => {
      Event.update(event, (err: Error, eventModel: any) => {
        if (err) {
          return reject(err)
        }
        return resolve(eventModel)
      })
    })
  }

  public deleteEvent(eventId: string, userId: string) {
    return new Promise((resolve, reject) => {
      Event.destroy(eventId, userId, (err: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  public getEventById(eventId: string) {
    return new Promise((resolve, reject) => {
      Event.query(eventId).exec((err: Error, eventModel: any) => {
        if (err) {
          reject(err)
        } else if (eventModel.Count < 1) {
          reject(new Error('Event not found'))
        } else {
          const event = eventModel.Items[0].attrs
          inviteGateway
            .getInvitesByEventId(event.eventId)
            .then((invites: any) => {
              resolve({
                ...event,
                invites: invites.map((invite: any) => invite.inviteId)
              })
            })
            .catch(inviteErr => {
              logError('Error fetching invite', inviteErr)
              resolve(event)
            })
        }
      })
    })
  }

  public getEventByInviteId(inviteId: string) {
    return new Promise((resolve, reject) => {
      inviteGateway
        .getInviteById(inviteId)
        .then((invite: IInvite) => {
          this.getEventById(invite.eventId)
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
    })
  }

  public getEventsByUserId(userId: string) {
    return new Promise((resolve: any, reject: any) => {
      Event.query(userId)
        .usingIndex('UserIdIndex')
        .exec((err: Error, eventModel: any) => {
          if (err) {
            reject(err)
          } else if (eventModel.Items.length < 1) {
            resolve([])
          } else {
            const eventList = eventModel.Items.map((item: any) => item.attrs)
            resolve(eventList)
          }
        })
    })
  }
}
