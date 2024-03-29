// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import Joi from 'joi'
import { eventTableName } from './modelConstants'

export const Event = dynamo.define(eventTableName, {
  hashKey: 'eventId',

  timestamps: true,

  schema: Joi.object({
    description: Joi.string()
      .allow('')
      .optional()
      .default(''),
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
    genre: Joi.string()
      .allow('')
      .optional(),
    name: Joi.string(),
    organizer: Joi.string(),
    playlistUrl: Joi.string(),
    startDateTime: Joi.string(),
    userId: Joi.string(),
    venue: Joi.string()
      .allow('')
      .optional(),
    settings: {
      dynamicVotingEnabled: Joi.bool().default(false),
      autoAcceptSuggestionsEnabled: Joi.bool().default(false),
      suggestingPlaylistsEnabled: Joi.bool().default(false)
    }
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'userId',
      name: 'UserIdIndex',
      type: 'global'
    }
  ]
})
