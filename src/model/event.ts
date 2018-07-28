// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'

export interface ILatLng {
  lat: string
  lng: string
}

export interface IEventLocation {
  address: string
  latLng: ILatLng
}

export interface IEvent {
  eventId: string
  usrId: string
  organizer: string
  imageUrl: string
  name: string
  description: string
  venue: string
  location: IEventLocation
  startDateTime: string
  endDateTime: string
  eventCode: string
  playlist: string
  invites: string[]
}

export const Event = dynamo.define('MM-Dev-Event', {
  hashKey: 'eventId',
  rangeKey: 'userId',

  timestamps: true,

  schema: {
    description: Joi.string()
      .allow('')
      .optional(),
    endDateTime: Joi.string(),
    eventCode: Joi.string()
      .allow('')
      .optional(),
    eventId: dynamo.types.uuid(),
    imageUrl: Joi.string()
      .allow('')
      .optional(),
    location: {
      address: Joi.string().default('Nowhere'),
      latLng: {
        lat: Joi.number().optional(),
        lng: Joi.number().optional()
      }
    },
    name: Joi.string(),
    organizer: Joi.string(),
    playlistUrl: Joi.string(),
    startDateTime: Joi.string(),
    userId: Joi.string(),
    venue: Joi.string()
      .allow('')
      .optional()
  },

  indexes: [
    {
      hashKey: 'userId',
      name: 'UserIdIndex',
      rangeKey: 'organizer',
      type: 'global'
    }
  ]
})
