// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import Joi from 'joi'
import { voteTableName } from './modelConstants'

export const Vote = dynamo.define(voteTableName, {
  hashKey: 'voteId',
  rangeKey: 'eventId',

  timestamps: true,

  schema: Joi.object({
    voteId: Joi.string(),
    trackId: Joi.string(),
    eventId: Joi.string(),
    userId: Joi.string()
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'eventId',
      rangeKey: 'userId',
      name: 'EventIdUserIdIndex',
      type: 'global'
    },
    {
      hashKey: 'userId',
      rangeKey: 'trackId',
      type: 'global',
      name: 'UserIdTrackIdIndex'
    },
    {
      hashKey: 'userId',
      name: 'UserIdIndex',
      type: 'global'
    }
  ]
})
