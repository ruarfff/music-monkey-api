// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { eventTableName } from './modelConstants'

export const Event = dynamo.define(eventTableName, {
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
      .optional(),
    settings: {
      dynamicVotingEnabled: Joi.bool().default(false)
    }
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
