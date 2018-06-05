import { Event, IEvent, IInvite } from '../model'
import InviteGateway from './inviteGateway'

const inviteGateway: InviteGateway = new InviteGateway()

export default class EventGateway {
  public createEvent(event: IEvent) {
    console.log('Am here', event)
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
              console.error(inviteCreateErr)
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
              console.error(inviteErr)
              resolve(event)
            })
        }
      })
    })
  }

  public getEventByInviteId(inviteId: string) {
    console.log('InviteID:', inviteId)
    return new Promise((resolve, reject) => {
      inviteGateway
        .getInviteById(inviteId)
        .then((invite: IInvite) => {
          console.log('Invite:', invite)
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
          if (err || eventModel.Items.length < 1) {
            reject(err)
          }
          const eventList = eventModel.Items.map((item: any) => item.attrs)
          resolve(eventList)
        })
    })
  }
}
