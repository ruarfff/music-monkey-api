import { Event, IEvent } from '../model'

export default class EventGateway {
  public createEvent(event: IEvent) {
    return new Promise((resolve, reject) => {
      Event.create(event, (err: Error, eventModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(eventModel)
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

  public deleteEvent(eventId: string) {
    return new Promise((resolve, reject) => {
      Event.destroy(eventId, (err: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  public getEventById(eventId: string) {
    return new Promise((resolve, reject) => {
      Event.get(eventId, (err: Error, eventModel: any) => {
        if (err) {
          return reject(err)
        }
        return resolve(eventModel)
      })
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
