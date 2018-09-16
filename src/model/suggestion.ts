// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { suggestionTableName } from './modelConstants'

export const Suggestion = dynamo.define(suggestionTableName, {
  hashKey: 'suggestionId',
  rangeKey: 'eventId',

  timestamps: true,

  schema: Joi.object({
    suggestionId: dynamo.types.uuid(),
    eventId: Joi.string(),
    userId: Joi.string(),
    type: Joi.string().valid(['track', 'playlist']),
    playlistUri: Joi.string()
      .optional()
      .allow(''),
    trackUri: Joi.string(),
    accepted: Joi.boolean().default(false),
    rejected: Joi.boolean().default(false)
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'eventId',
      name: 'UserEventIdIndex',
      rangeKey: 'userId',
      type: 'global'
    },
    {
      hashKey: 'userId',
      name: 'UserIdIndex',
      type: 'global'
    }
  ]
})
